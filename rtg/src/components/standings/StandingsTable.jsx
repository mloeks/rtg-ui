import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import Notification from '../Notification';
import { lightGrey } from '../../theme/RtgTheme';
import StandingsTableRow from './StandingsTableRow';

import './StandingsTable.css';

export const rankColumnStyle = {
  width: '23px',
  textAlign: 'center',
  padding: '0 5px',
};

export const betStatColumnStyle = {
  width: '20px',
  textAlign: 'center',
  padding: '0 5px',
  color: lightGrey,
};

export const betColumnStyle = {
  ...betStatColumnStyle,
  width: '30px',
};

export const pointsColumnStyle = {
  width: '30px',
  textAlign: 'right',
  padding: '0 15px 0 5px',
  fontSize: '16px',
  fontWeight: 'bold',
};

// TODO P3 add scroll listener if scrollable and remove fading top/bottom when
// scrolled to top/bottom. Alternatively, just remove the fading elements in StandingsTable.scss
// for --excerpt-scrollable
// TODO P3 FEATURE Prio 3 alle bets in Tabelle anzeigen (scrollbar) (a la Kicktipp / Doodle)
class StandingsTable extends Component {
  // TODO P2 take noBets into account?
  static identicalRank(row, lastRow) {
    return row && lastRow &&
      row.points === lastRow.points && row.noVolltreffer === lastRow.noVolltreffer;
  }

  static statsToStateMapper(stats) {
    return {
      loadingError: false,
      rows: StandingsTable.enhanceRowsWithDisplayRanks(
        stats.map(statObj => ({
          userId: statObj.user,
          username: statObj.username,
          userAvatar: statObj.user_avatar,
          points: statObj.points,
          noBets: statObj.no_bets,
          noVolltreffer: statObj.no_volltreffer,
          noDifferenz: statObj.no_differenz,
          noRemisTendenz: statObj.no_remis_tendenz,
          noTendenz: statObj.no_tendenz,
          noNiete: statObj.no_niete,
        })),
      ),
    };
  }

  // used when tournament has not yet started and table only contains all users with 0 points
  static usersOnlyToStateMapper(users) {
    return {
      loadingError: false,
      rows: StandingsTable.enhanceRowsWithDisplayRanks(
        users.map(user => ({
          userId: user.pk,
          username: user.username,
          userAvatar: user.avatar,
          points: 0,
          noBets: 0,
          noVolltreffer: 0,
          noDifferenz: 0,
          noRemisTendenz: 0,
          noTendenz: 0,
          noNiete: 0,
        })),
      ),
    };
  }

  static enhanceRowsWithDisplayRanks(rows) {
    let lastRow = null;
    return rows.map((row, ix) => {
      const rankEnhancedRow = Object.assign({}, row);
      rankEnhancedRow.displayRank =
        StandingsTable.identicalRank(row, lastRow) ? '' : (ix + 1).toString();
      lastRow = row;
      return rankEnhancedRow;
    });
  }

  constructor(props) {
    super(props);
    this.state = { rows: [], bets: [] };
    this.tableContainerRef = React.createRef();

    this.fetchStatistics = this.fetchStatistics.bind(this);
    this.fetchBets = this.fetchBets.bind(this);
  }

  componentDidMount() {
    this.fetchStatistics();
    if (this.props.showBetColumnForBettable !== -1) {
      this.fetchBets();
    }
  }

  componentDidUpdate() {
    if (this.props.scrollable && this.tableContainerRef.current) {
      this.tableContainerRef.current.scrollTop = this.getScrollTop();
    }
  }

  getDisplayedRows(rows, classList) {
    if (this.props.showOnlyUserExcerpt) {
      if (this.props.scrollable) {
        classList.push('StandingsTable--scrollable-excerpt');
        return rows;
      }

      // if the table does not need to be scrollable, we can only
      // put the visible rows into the DOM, not all rows.
      classList.push('StandingsTable--excerpt');

      const userRank = rows.findIndex(r => r.userId === AuthService.getUserId());
      const numberUsersAroundUserOneSide = Math.floor(this.props.userExcerptRows / 2);
      const fromIndex = userRank - numberUsersAroundUserOneSide;
      if (fromIndex <= 0) {
        // top end
        classList.push('StandingsTable--excerpt-bottom-fade');
        return rows.slice(0, this.props.userExcerptRows);
      }

      const toIndex = userRank + numberUsersAroundUserOneSide;
      if (toIndex >= rows.length - 1) {
        // bottom end
        classList.push('StandingsTable--excerpt-top-fade');
        return rows.slice(-this.props.userExcerptRows);
      }

      classList.push('StandingsTable--excerpt-top-fade');
      classList.push('StandingsTable--excerpt-bottom-fade');
      return rows.slice(fromIndex, toIndex + 1);
    }
    return rows;
  }

  getDisplayedRowsWithBets(rows) {
    return rows.map((row) => {
      const enhancedRow = Object.assign({}, row);
      const bet = this.state.bets
        .find(b => b.bettable === this.props.showBetColumnForBettable && b.user === row.userId);
      enhancedRow.bet = bet ? bet.result_bet : null;
      return enhancedRow;
    });
  }

  getScrollTop() {
    const maxScrollTopRows = this.state.rows.length - this.props.userExcerptRows;
    const userIndex = this.state.rows.findIndex(r => r.userId === AuthService.getUserId());
    const halfExcerptHeightInRows = 0.5 * (this.props.userExcerptRows - 1);

    const scrollTopRows = Math.min(userIndex - halfExcerptHeightInRows, maxScrollTopRows);
    return scrollTopRows * (this.props.rowHeight + 1);
  }

  fetchStatistics() {
    fetch(
      `${API_BASE_URL}/rtg/statistics/`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then((response) => {
      if (response.ok) {
        this.setState({ loading: false, ...StandingsTable.statsToStateMapper(response.json) });
      } else {
        this.setState(response.status === 412 ?
          this.fetchUsersOnly() : { loading: false, loadingError: true });
      }
    }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  fetchUsersOnly() {
    fetch(`${API_BASE_URL}/rtg/users_public/`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then(response => (
      this.setState({
        loading: false,
        ...response.ok ?
          StandingsTable.usersOnlyToStateMapper(response.json) : { loadingError: true },
      })
    )).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  fetchBets() {
    fetch(
      `${API_BASE_URL}/rtg/bets/?bettable=${this.props.showBetColumnForBettable}`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then((response) => {
      this.setState(() => {
        if (response.ok) {
          return { loading: false, bets: response.json };
        }
        return { loading: false, loadingError: true };
      });
    }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  render() {
    const standingsTableClassList = ['StandingsTable'];
    let displayedRows = this.getDisplayedRows(this.state.rows, standingsTableClassList);

    if (this.props.showBetColumnForBettable !== -1 && this.state.bets) {
      displayedRows = this.getDisplayedRowsWithBets(displayedRows);
    }

    const innerTableHeight = this.props.showOnlyUserExcerpt && this.props.scrollable ?
      this.props.userExcerptRows * (this.props.rowHeight + 1) : 'auto';

    return (
      <div className={standingsTableClassList.join(' ')}>
        <div
          className="StandingsTable__inner"
          ref={this.tableContainerRef}
          style={{ height: innerTableHeight }}
        >
          {this.state.loading && <CircularProgress className="StandingsTable__loading-spinner" />}
          {this.state.loadingError &&
            <Notification
              title="Es ist ein Fehler aufgetreten"
              subtitle="Bitte versuche es später noch einmal."
              type="error"
              containerStyle={{ margin: '25px 0' }}
            />}

          {(!this.state.loading && !this.state.loadingError) &&
            <Table className="StandingsTable__table" selectable={false}>
              {this.props.showTableHeader &&
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                  enableSelectAll={false}
                >
                  <TableRow>
                    <TableHeaderColumn style={rankColumnStyle}>Pl.</TableHeaderColumn>
                    <TableHeaderColumn style={{ paddingLeft: '5px' }}>Username</TableHeaderColumn>
                    {this.props.showBetColumnForBettable !== -1 &&
                      <TableHeaderColumn
                        className="StandingsTable__bet-col"
                        style={betColumnStyle}
                      >Tipp
                      </TableHeaderColumn>
                    }
                    {this.props.showStatsColumns &&
                      <Fragment>
                        <TableHeaderColumn style={betStatColumnStyle}>V</TableHeaderColumn>
                        <TableHeaderColumn
                          className="StandingsTable__stat-col-desktop"
                          style={betStatColumnStyle}
                        >D
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="StandingsTable__stat-col-desktop"
                          style={betStatColumnStyle}
                        >RT
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="StandingsTable__stat-col-desktop"
                          style={betStatColumnStyle}
                        >T
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="StandingsTable__stat-col-desktop"
                          style={betStatColumnStyle}
                        >N
                        </TableHeaderColumn>
                      </Fragment>}
                    <TableHeaderColumn
                      style={{ ...pointsColumnStyle, fontWeight: 'normal', fontSize: '13px' }}
                    >Pkt.
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>}

              <TableBody showRowHover displayRowCheckbox={false}>
                {displayedRows.map(row => (<StandingsTableRow
                  key={row.userId}
                  rank={row.displayRank}
                  rowHeight={this.props.rowHeight}
                  self={AuthService.getUserId() === row.userId}
                  showBetColumn={this.props.showBetColumnForBettable !== -1}
                  showStatsColumns={this.props.showStatsColumns}
                  {...row}
                />))}
              </TableBody>
            </Table>}
        </div>
      </div>
    );
  }
}

StandingsTable.defaultProps = {
  rowHeight: 65,
  scrollable: false,
  showBetColumnForBettable: -1,
  showOnlyUserExcerpt: false,
  showStatsColumns: true,
  showTableHeader: true,
  userExcerptRows: 5,
};

StandingsTable.propTypes = {
  rowHeight: PropTypes.number,
  scrollable: PropTypes.bool,
  showBetColumnForBettable: PropTypes.number,
  showOnlyUserExcerpt: PropTypes.bool,
  showStatsColumns: PropTypes.bool,
  showTableHeader: PropTypes.bool,
  userExcerptRows: PropTypes.number,
};

export default StandingsTable;
