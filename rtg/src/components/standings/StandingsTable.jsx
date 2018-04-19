import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import Notification from '../Notification';
import UserAvatar from '../UserAvatar';
import { lightGrey } from '../../theme/RtgTheme';

import './StandingsTable.css';

const ROW_HEIGHT = 65;

const rankColumnStyle = {
  width: '23px',
  textAlign: 'center',
  padding: '0 5px',
};

const betStatColumnStyle = {
  width: '20px',
  textAlign: 'center',
  padding: '0 5px',
  color: lightGrey,
};

const pointsColumnStyle = {
  width: '30px',
  textAlign: 'right',
  padding: '0 15px 0 5px',
  fontSize: '16px',
  fontWeight: 'bold',
};

const StandingsTableRow = (props) => {
  return (
    <TableRow style={{ height: ROW_HEIGHT }} className="StandingsTableRow">
      <TableRowColumn style={rankColumnStyle}>{props.rank}</TableRowColumn>
      <TableRowColumn style={{
        height: ROW_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        paddingLeft: 0,
      }}
      ><UserAvatar
        img={props.userAvatar ? `${API_BASE_URL}/media/${props.userAvatar}` : null}
        size={0.65 * ROW_HEIGHT}
        username={props.username}
        style={{ marginRight: '10px', minWidth: 0.65 * ROW_HEIGHT }}
      /><span className="TableRowColumn__username">{props.username}</span>
      </TableRowColumn>
      <TableRowColumn style={betStatColumnStyle}>{props.noVolltreffer}</TableRowColumn>

      <TableRowColumn
        className="StandingsTable__stat-col-desktop"
        style={betStatColumnStyle}
      >{props.noDifferenz}
      </TableRowColumn>
      <TableRowColumn
        className="StandingsTable__stat-col-desktop"
        style={betStatColumnStyle}
      >{props.noRemisTendenz}
      </TableRowColumn>
      <TableRowColumn
        className="StandingsTable__stat-col-desktop"
        style={betStatColumnStyle}
      >{props.noTendenz}
      </TableRowColumn>
      <TableRowColumn
        className="StandingsTable__stat-col-desktop"
        style={betStatColumnStyle}
      >{props.noNiete}
      </TableRowColumn>

      <TableRowColumn style={pointsColumnStyle}>{props.points}</TableRowColumn>
    </TableRow>
  );
};

StandingsTableRow.defaultProps = {
  rank: '',
  userAvatar: null,
};

StandingsTableRow.propTypes = {
  rank: PropTypes.string,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  userAvatar: PropTypes.string,
  points: PropTypes.number.isRequired,
  noBets: PropTypes.number.isRequired,
  noVolltreffer: PropTypes.number.isRequired,
  noDifferenz: PropTypes.number.isRequired,
  noRemisTendenz: PropTypes.number.isRequired,
  noTendenz: PropTypes.number.isRequired,
  noNiete: PropTypes.number.isRequired,
};

// TODO P2 User Details onClick --> Spalte wird höher und zeigt Details des Users + größeren Avatar
// TODO P3 alle bets in Tabelle anzeigen (scrollbar) (a la Kicktipp / Doodle)
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

  render() {
    let lastRow = null;

    return (
      <div className="StandingsTable">
        {this.state.loading && <CircularProgress className="StandingsTable__loading-spinner" />}
        {this.state.loadingError &&
          <Notification
            title="Es ist ein Fehler aufgetreten"
            subtitle="Bitte versuche es später noch einmal."
            type="error"
            style={{ margin: '25px 0' }}
          />}

        {(!this.state.loading && !this.state.loadingError) &&
          <Table className="StandingsTable__table" selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={rankColumnStyle}>Pl.</TableHeaderColumn>
                <TableHeaderColumn style={{ paddingLeft: '5px' }}>Username</TableHeaderColumn>
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
                <TableHeaderColumn
                  style={{ ...pointsColumnStyle, fontWeight: 'normal', fontSize: '13px' }}
                >Pkt.
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover displayRowCheckbox={false}>
              {this.state.rows.map((row, ix) => {
                const displayRank =
                  StandingsTable.identicalRank(row, lastRow) ? '' : (ix + 1).toString();
                lastRow = row;
                  return <StandingsTableRow key={row.userId} rank={displayRank} {...row} />;
                })}
            </TableBody>
          </Table>}
      </div>
    );
  }
}

export default StandingsTable;
