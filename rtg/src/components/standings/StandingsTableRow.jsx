import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui';
import { betColumnStyle, betStatColumnStyle, pointsColumnStyle, rankColumnStyle } from './StandingsTable';
import UserAvatar from '../UserAvatar';
import UserDetailsPopover from '../UserDetailsPopover';
import { isEnter } from '../../service/KeyHelper';

import './StandingsTableRow.css';

class StandingsTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = { userDetailsPopoverAnchorEl: null, userDetailsPopoverOpen: false };
    this.showUserDetailsPopover = this.showUserDetailsPopover.bind(this);
    this.hideUserDetailsPopover = this.hideUserDetailsPopover.bind(this);
  }

  showUserDetailsPopover(e) {
    if (this.props.showUserInfoOnClick) {
      e.preventDefault();
      this.setState({ userDetailsPopoverOpen: true, userDetailsPopoverAnchorEl: e.currentTarget });
    }
  }

  hideUserDetailsPopover() {
    this.setState({ userDetailsPopoverOpen: false });
  }

  render() {
    const rowHeight = this.props.rowHeight;
    return (
      <Fragment>
        <TableRow
          style={{ height: rowHeight }}
          className={`StandingsTableRow ${this.props.self ? 'StandingsTableRow--self' : null}`}
        >
          <TableRowColumn style={{ ...rankColumnStyle, height: rowHeight }}>
            {this.props.rank}
          </TableRowColumn>
          <TableRowColumn style={{ height: rowHeight, padding: 0 }}>
            <div
              role={this.props.showUserInfoOnClick ? 'button' : null}
              className="TableRowColumn__user-wrapper"
              tabIndex={this.props.showUserInfoOnClick ? 0 : null}
              onClick={this.showUserDetailsPopover}
              onKeyPress={e => (isEnter(e) && this.showUserDetailsPopover(e))}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px',
                paddingLeft: 0,
              }}
            >
              <UserDetailsPopover
                anchorEl={this.state.userDetailsPopoverAnchorEl}
                avatar={this.props.userAvatar}
                userId={this.props.userId}
                username={this.props.username}
                open={this.state.userDetailsPopoverOpen}
                onClose={this.hideUserDetailsPopover}
              />

              <UserAvatar
                img={this.props.userAvatar}
                size={0.65 * rowHeight}
                username={this.props.username}
                style={{ marginRight: '10px', minWidth: 0.65 * rowHeight }}
              />
              <span
                className={`TableRowColumn__${rowHeight < 55 ? 'username' : 'username--multi-line'}`}
                style={{ maxHeight: 0.65 * rowHeight }}
              >{this.props.username}
              </span>
            </div>
          </TableRowColumn>

          {this.props.showBetColumn &&
            <TableRowColumn style={{ ...betColumnStyle, height: rowHeight, fontSize: '16px' }}>
              {this.props.bet || '---'}
            </TableRowColumn>}

          {this.props.showStatsColumns &&
            <Fragment>
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
            </Fragment>}

          <TableRowColumn style={{ ...pointsColumnStyle, height: rowHeight }}>
            {this.props.points}
          </TableRowColumn>
        </TableRow>
      </Fragment>
    );
  }
}

StandingsTableRow.defaultProps = {
  self: false,
  rank: '',
  userAvatar: null,
  bet: null,
  showBetColumn: false,
  showStatsColumns: true,
  showUserInfoOnClick: true,
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
  bet: PropTypes.string,

  self: PropTypes.bool,
  rowHeight: PropTypes.number.isRequired,
  showBetColumn: PropTypes.bool,
  showStatsColumns: PropTypes.bool,
  showUserInfoOnClick: PropTypes.bool,
};

export default StandingsTableRow;
