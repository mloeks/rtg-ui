import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import Notification from '../Notification';
import { lightGrey, purple } from '../../theme/RtgTheme';
import StandingsTableRow from './StandingsTableRow';

import './StandingsTable.css';

export const baseRankColumnStyle = {
  width: '23px',
  textAlign: 'center',
  padding: '0 5px',
};

export const baseBetStatColumnStyle = {
  width: '20px',
  textAlign: 'center',
  padding: '0 5px',
  color: lightGrey,
};

export const baseBetColumnStyle = {
  width: '50px',
  textAlign: 'right',
  padding: '0 5px',
  color: purple,
};

export const basePointsColumnStyle = {
  width: '30px',
  textAlign: 'right',
  padding: '0 15px 0 5px',
  fontSize: '16px',
  fontWeight: 'bold',
};

// TODO P3 check loading state (often takes longer and does not show progress indicator)
// TODO P3 add scroll listener if scrollable and remove fading top/bottom when
// scrolled to top/bottom. Alternatively, just remove the fading elements in StandingsTable.scss
// for --excerpt-scrollable
// TODO P3 FEATURE Prio 3 alle bets in Tabelle anzeigen (scrollbar) (a la Kicktipp / Doodle)
class StandingsTable extends Component {
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.bets) {
      return { bets: nextProps.bets };
    }
    return null;
  }

  static identicalRank(row, lastRow) {
    return row && lastRow && row.points === lastRow.points;
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
      rankEnhancedRow.displayRank = StandingsTable.identicalRank(row, lastRow) ? ''
        : (ix + 1).toString();
      lastRow = row;
      return rankEnhancedRow;
    });
  }

  constructor(props) {
    super(props);
    this.state = { rows: [], bets: props.bets };
    this.tableContainerRef = React.createRef();

    this.fetchStatistics = this.fetchStatistics.bind(this);
    this.fetchBets = this.fetchBets.bind(this);
  }

  componentDidMount() {
    const { bets, showBetColumnForBettable } = this.props;
    this.fetchStatistics();
    if (showBetColumnForBettable !== -1 && !bets) {
      this.fetchBets();
    }
  }

  componentDidUpdate() {
    const { scrollable } = this.props;
    if (scrollable && this.tableContainerRef.current) {
      this.tableContainerRef.current.scrollTop = this.getScrollTop();
    }
  }

  getDisplayedRows(rows, classList) {
    const { scrollable, showOnlyUserExcerpt, userExcerptRows } = this.props;
    if (showOnlyUserExcerpt) {
      if (scrollable) {
        classList.push('StandingsTable--scrollable-excerpt');
        return rows;
      }

      // if the table does not need to be scrollable, we can only
      // put the visible rows into the DOM, not all rows.
      classList.push('StandingsTable--excerpt');

      const userRank = rows.findIndex(r => r.userId === AuthService.getUserId());
      const numberUsersAroundUserOneSide = Math.floor(userExcerptRows / 2);
      const fromIndex = userRank - numberUsersAroundUserOneSide;
      if (fromIndex <= 0) {
        // top end
        classList.push('StandingsTable--excerpt-bottom-fade');
        return rows.slice(0, userExcerptRows);
      }

      const toIndex = userRank + numberUsersAroundUserOneSide;
      if (toIndex >= rows.length - 1) {
        // bottom end
        classList.push('StandingsTable--excerpt-top-fade');
        return rows.slice(-userExcerptRows);
      }

      classList.push('StandingsTable--excerpt-top-fade');
      classList.push('StandingsTable--excerpt-bottom-fade');
      return rows.slice(fromIndex, toIndex + 1);
    }
    return rows;
  }

  getDisplayedRowsWithBets(rows) {
    const { bets } = this.state;
    const { showBetColumnForBettable } = this.props;
    return rows.map((row) => {
      const enhancedRow = Object.assign({}, row);
      const bet = bets.find(b => b.bettable === showBetColumnForBettable && b.user === row.userId);
      enhancedRow.bet = bet || null;
      return enhancedRow;
    });
  }

  getScrollTop() {
    const { rows } = this.state;
    const { rowHeight, userExcerptRows } = this.props;
    const maxScrollTopRows = rows.length - userExcerptRows;
    const userIndex = rows.findIndex(r => r.userId === AuthService.getUserId());
    const halfExcerptHeightInRows = 0.5 * (userExcerptRows - 1);

    const scrollTopRows = Math.min(userIndex - halfExcerptHeightInRows, maxScrollTopRows);
    return scrollTopRows * (rowHeight + 1);
  }

  fetchStatistics() {
    fetch(
      `${API_BASE_URL}/rtg/statistics/`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then((response) => {
      if (response.ok) {
        this.setState({ loading: false, ...StandingsTable.statsToStateMapper(response.json) });
      } else {
        this.setState(response.status === 412
          ? this.fetchUsersOnly() : { loading: false, loadingError: true });
      }
    }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  fetchUsersOnly() {
    fetch(`${API_BASE_URL}/rtg/users_public/`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } })
      .then(FetchHelper.parseJson).then(response => (
        this.setState({
          loading: false,
          ...response.ok
            ? StandingsTable.usersOnlyToStateMapper(response.json)
            : { loadingError: true },
        })
      )).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  fetchBets() {
    const { showBetColumnForBettable } = this.props;
    fetch(`${API_BASE_URL}/rtg/bets/?bettable=${showBetColumnForBettable}`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } })
      .then(FetchHelper.parseJson).then((response) => {
        this.setState(() => {
          if (response.ok) {
            return { loading: false, bets: response.json };
          }
          return { loading: false, loadingError: true };
        });
      }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  render() {
    const {
      bets,
      loading,
      loadingError,
      rows,
    } = this.state;

    const {
      betColumnStyle,
      rowHeight,
      scrollable,
      showBetColumnForBettable,
      showOnlyUserExcerpt,
      showStatsColumns,
      showTableHeader,
      showUserAvatar,
      showUserInfoOnClick,
      userExcerptRows,
    } = this.props;

    const standingsTableClassList = ['StandingsTable'];
    let displayedRows = this.getDisplayedRows(rows, standingsTableClassList);

    if (showBetColumnForBettable !== -1 && bets) {
      displayedRows = this.getDisplayedRowsWithBets(displayedRows);
    }

    const innerTableHeight = showOnlyUserExcerpt && scrollable
      ? userExcerptRows * (rowHeight + 1) : 'auto';

    return (
      <div className={standingsTableClassList.join(' ')} style={{ touchAction: 'pan-y' }}>
        <div
          className="StandingsTable__inner"
          ref={this.tableContainerRef}
          style={{ height: innerTableHeight }}
        >
          {loading && <CircularProgress className="StandingsTable__loading-spinner" />}
          {loadingError && (
            <Notification
              title="Es ist ein Fehler aufgetreten"
              subtitle="Bitte versuche es später noch einmal."
              type="error"
              containerStyle={{ margin: '25px 0' }}
            />
          )}

          {(!loading && !loadingError) && (
            <Table className="StandingsTable__table">
              {showTableHeader && (
                <TableHead>
                  <TableRow>
                    <TableCell style={baseRankColumnStyle}>Pl.</TableCell>
                    <TableCell style={{ paddingLeft: '5px' }}>Username</TableCell>
                    {showBetColumnForBettable !== -1 && (
                      <TableCell
                        className="StandingsTable__bet-col"
                        style={{ ...baseBetColumnStyle, ...betColumnStyle }}
                      >
                        Tipp
                      </TableCell>
                    )}
                    {showStatsColumns && (
                      <Fragment>
                        <TableCell style={baseBetStatColumnStyle}>V</TableCell>
                        <TableCell
                          className="StandingsTable__stat-col-desktop"
                          style={baseBetStatColumnStyle}
                        >
                          D
                        </TableCell>
                        <TableCell
                          className="StandingsTable__stat-col-desktop"
                          style={baseBetStatColumnStyle}
                        >
                          RT
                        </TableCell>
                        <TableCell
                          className="StandingsTable__stat-col-desktop"
                          style={baseBetStatColumnStyle}
                        >
                          T
                        </TableCell>
                        <TableCell
                          className="StandingsTable__stat-col-desktop"
                          style={baseBetStatColumnStyle}
                        >
                          N
                        </TableCell>
                      </Fragment>
                    )}
                    <TableCell
                      style={{ ...basePointsColumnStyle, fontWeight: 'normal', fontSize: '13px' }}
                    >
                      Pkt.
                    </TableCell>
                  </TableRow>
                </TableHead>
              )}

              <TableBody>
                {displayedRows.map(row => (
                  <StandingsTableRow
                    key={row.userId}
                    rank={row.displayRank}
                    rowHeight={rowHeight}
                    self={AuthService.getUserId() === row.userId}
                    showBetColumn={showBetColumnForBettable !== -1}
                    showStatsColumns={showStatsColumns}
                    showUserAvatar={showUserAvatar}
                    showUserInfoOnClick={showUserInfoOnClick}
                    betColumnStyle={{ ...baseBetColumnStyle, betColumnStyle }}
                    {...row}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    );
  }
}

StandingsTable.defaultProps = {
  rowHeight: 60,
  scrollable: false,

  showOnlyUserExcerpt: false,
  userExcerptRows: 5,
  showStatsColumns: true,
  showTableHeader: true,
  showUserAvatar: true,
  showUserInfoOnClick: true,

  showBetColumnForBettable: -1,
  bets: [],
  betColumnStyle: {},
};

StandingsTable.propTypes = {
  rowHeight: PropTypes.number,

  scrollable: PropTypes.bool,
  showOnlyUserExcerpt: PropTypes.bool,
  userExcerptRows: PropTypes.number,
  showStatsColumns: PropTypes.bool,
  showTableHeader: PropTypes.bool,
  showUserAvatar: PropTypes.bool,
  showUserInfoOnClick: PropTypes.bool,

  showBetColumnForBettable: PropTypes.number,
  // can be passed in if the previous option is set
  // if it is empty, the bets are fetched by this component
  bets: PropTypes.array,
  betColumnStyle: PropTypes.object,
};

export default StandingsTable;
