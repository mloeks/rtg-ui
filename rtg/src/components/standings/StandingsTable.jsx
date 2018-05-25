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

export const pointsColumnStyle = {
  width: '30px',
  textAlign: 'right',
  padding: '0 15px 0 5px',
  fontSize: '16px',
  fontWeight: 'bold',
};

// TODO P3 FEATURE Prio 3 alle bets in Tabelle anzeigen (scrollbar) (a la Kicktipp / Doodle)
class StandingsTable extends Component {
  static identicalRank(row, lastRow) {
    return row && lastRow &&
      row.points === lastRow.points && row.noVolltreffer === lastRow.noVolltreffer;
  }

  static statsToStateMapper(stats) {
    return {
      loadingError: false,
      rows: stats.map(statObj => ({
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
    };
  }

  // used when tournament has not yet started and table only contains all users with 0 points
  static usersOnlyToStateMapper(users) {
    return {
      loadingError: false,
      rows: users.map(user => ({
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
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    fetch(`${API_BASE_URL}/rtg/statistics/`,
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

  getExcerptUserScrollTopStyle(totalUsers, userRank) {
    if (userRank === 0) {
      return { top: 0 };
    }
    if (userRank === totalUsers - 1) {
      return { bottom: 0 };
    }

    return { top: -0.5 * (userRank * this.props.rowHeight) };
  }

  render() {
    let lastRow = null;
    const totalUsers = this.state.rows.length;
    const userRank = this.state.rows.findIndex(r => r.userId === AuthService.getUserId());
    const excerptHeight = this.props.userExcerptRows * this.props.rowHeight;
    const wrapperStyle = this.props.showOnlyUserExcerpt ?
      { position: 'absolute', ...this.getExcerptUserScrollTopStyle(totalUsers, userRank) } : {};

    const standingsTableClassList = ['StandingsTable'];
    if (this.props.showOnlyUserExcerpt) {
      standingsTableClassList.push('StandingsTable--excerpt');
      if (userRank !== 0) {
        standingsTableClassList.push('StandingsTable--excerpt-top-fade');
      }
      if (userRank !== totalUsers - 1) {
        standingsTableClassList.push('StandingsTable--excerpt-bottom-fade');
      }
    }

    return (
      <div
        className={standingsTableClassList.join(' ')}
        style={this.props.showOnlyUserExcerpt ? { height: excerptHeight } : {}}
      >
        {this.state.loading && <CircularProgress className="StandingsTable__loading-spinner" />}
        {this.state.loadingError &&
          <Notification
            title="Es ist ein Fehler aufgetreten"
            subtitle="Bitte versuche es später noch einmal."
            type="error"
            style={{ margin: '25px 0' }}
          />}

        {(!this.state.loading && !this.state.loadingError) &&
          <Table
            className="StandingsTable__table"
            selectable={false}
            wrapperStyle={wrapperStyle}
          >
            {this.props.showTableHeader &&
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
              >
                <TableRow>
                  <TableHeaderColumn style={rankColumnStyle}>Pl.</TableHeaderColumn>
                  <TableHeaderColumn style={{ paddingLeft: '5px' }}>Username</TableHeaderColumn>
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
              {this.state.rows.map((row, ix) => {
                const displayRank =
                  StandingsTable.identicalRank(row, lastRow) ? '' : (ix + 1).toString();
                lastRow = row;
                  return (<StandingsTableRow
                    key={row.userId}
                    rank={displayRank}
                    rowHeight={this.props.rowHeight}
                    self={AuthService.getUserId() === row.userId}
                    showStatsColumns={this.props.showStatsColumns}
                    {...row}
                  />);
                })}
            </TableBody>
          </Table>}
      </div>
    );
  }
}

StandingsTable.defaultProps = {
  rowHeight: 65,
  showOnlyUserExcerpt: false,
  showStatsColumns: true,
  showTableHeader: true,
  userExcerptRows: 5,
};

StandingsTable.propTypes = {
  rowHeight: PropTypes.number,
  showOnlyUserExcerpt: PropTypes.bool,
  showStatsColumns: PropTypes.bool,
  showTableHeader: PropTypes.bool,
  userExcerptRows: PropTypes.number,
};

export default StandingsTable;
