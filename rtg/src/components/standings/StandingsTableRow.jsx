import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui';
import AuthService from '../../service/AuthService';
import { betStatColumnStyle, pointsColumnStyle, rankColumnStyle, ROW_HEIGHT } from './StandingsTable';
import UserAvatar from '../UserAvatar';

import './StandingsTableRow.css';

// TODO P1 User Details onClick --> User Details als Popover, schönes Pattern als bg,
// runde Ecken, Avatar steht oben raus
class StandingsTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = { userDetailsPopoverOpen: false };
  }

  render() {
    return (
      <TableRow
        style={{ height: ROW_HEIGHT }}
        className={`StandingsTableRow ${this.props.userId === AuthService.getUserId() ? 'StandingsTableRow--self' : null}`}
      >
        <TableRowColumn style={rankColumnStyle}>{this.props.rank}</TableRowColumn>
        <TableRowColumn style={{
          height: ROW_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          fontSize: '16px',
          paddingLeft: 0,
        }}
        ><UserAvatar
          img={this.props.userAvatar}
          size={0.65 * ROW_HEIGHT}
          username={this.props.username}
          style={{ marginRight: '10px', minWidth: 0.65 * ROW_HEIGHT }}
        /><span className="TableRowColumn__username">{this.props.username}</span>
        </TableRowColumn>
        <TableRowColumn style={betStatColumnStyle}>{this.props.noVolltreffer}</TableRowColumn>

        <TableRowColumn
          className="StandingsTable__stat-col-desktop"
          style={betStatColumnStyle}
        >{this.props.noDifferenz}
        </TableRowColumn>
        <TableRowColumn
          className="StandingsTable__stat-col-desktop"
          style={betStatColumnStyle}
        >{this.props.noRemisTendenz}
        </TableRowColumn>
        <TableRowColumn
          className="StandingsTable__stat-col-desktop"
          style={betStatColumnStyle}
        >{this.props.noTendenz}
        </TableRowColumn>
        <TableRowColumn
          className="StandingsTable__stat-col-desktop"
          style={betStatColumnStyle}
        >{this.props.noNiete}
        </TableRowColumn>

        <TableRowColumn style={pointsColumnStyle}>{this.props.points}</TableRowColumn>
      </TableRow>
    );
  }
}

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

export default StandingsTableRow;
