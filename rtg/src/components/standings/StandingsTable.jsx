import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
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

import './StandingsTable.css';

const StandingsTableRow = props => (
  <TableRow className="StandingsTableRow">
    <TableRowColumn>{props.rank}</TableRowColumn>
    <TableRowColumn>
      <Avatar>{props.username[0].toUpperCase()}</Avatar>
    </TableRowColumn>
    <TableRowColumn>{props.username}</TableRowColumn>
    <TableRowColumn style={{ textAlign: 'right' }}>{props.points}</TableRowColumn>
  </TableRow>
);

StandingsTableRow.propTypes = {
  rank: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  noBets: PropTypes.number.isRequired,
  noVolltreffer: PropTypes.number.isRequired,
  noDifferenz: PropTypes.number.isRequired,
  noRemisTendenz: PropTypes.number.isRequired,
  noTendenz: PropTypes.number.isRequired,
  noNiete: PropTypes.number.isRequired,
};

// TODO P1 Avatar URLs aus dem Backend mitliefern.
// TODO P1 Plätze korrekt durchnummerieren
// TODO P2 Fehler beim Laden schön machen.
// TODO P2 andere Spalten anzeigen
// TODO P3 random colours für User ohne Avatar.
class StandingsTable extends Component {
  static statsToStateMapper(stats) {
    return {
      loading: true,
      loadingError: false,

      rows: stats.map(statObj => ({
        userId: statObj.user,
        username: statObj.username,
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

  constructor(props) {
    super(props);

    this.state = {
      rows: [],
    };
  }

  async componentDidMount() {
    await this.fetchData(`${API_BASE_URL}/rtg/statistics/`, StandingsTable.statsToStateMapper);
    this.setState({ loading: false });
  }

  // TODO could this be wrapped in a FetchHelper method using Promises??
  async fetchData(url, responseToStateMapper) {
    return fetch(url, { headers: { Authorization: `Token ${AuthService.getToken()}` }})
      .then(FetchHelper.parseJson).then((response) => {
        this.setState(() => (response.ok
          ? responseToStateMapper(response.json) : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  render() {
    const rankColumnStyle = {
      width: '20px',
      textAlign: 'center',
      padding: '0 10px',
    };
    const pointsColumnStyle = {
      width: '40px',
      textAlign: 'right',
      padding: '0 15px 0 5px',
    };

    return (
      <div className="StandingsTable">
        {this.state.loading && <CircularProgress className="StandingsTable__loading-spinner" />}
        {this.state.loadingError &&
          <div className="StandingsTable__loading-error">Fehler beim Laden.</div> }
        <Table className="StandingsTable__table" selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={rankColumnStyle}>Pl.</TableHeaderColumn>
              <TableHeaderColumn style={{ paddingLeft: '5px' }} colSpan={2}>Username</TableHeaderColumn>
              <TableHeaderColumn style={pointsColumnStyle}>Punkte</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover displayRowCheckbox={false}>
            {this.state.rows.map((row, ix) => (
              <TableRow key={row.userId}>
                <TableRowColumn style={rankColumnStyle}>{ix + 1}</TableRowColumn>
                <TableRowColumn style={{ padding: '0 5px', width: '32px', textAlign: 'center' }}>
                  <Avatar size={32}>{row.username[0].toUpperCase()}</Avatar>
                </TableRowColumn>
                <TableRowColumn style={{ paddingLeft: '5px' }}>{row.username}</TableRowColumn>
                <TableRowColumn style={pointsColumnStyle}>{row.points}</TableRowColumn>
              </TableRow>))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default StandingsTable;
