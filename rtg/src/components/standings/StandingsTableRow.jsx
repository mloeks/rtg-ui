import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { baseBetStatColumnStyle, basePointsColumnStyle, baseRankColumnStyle, } from './StandingsTable';
import UserAvatar from '../UserAvatar';
import UserDetailsPopover from '../UserDetailsPopover';
import { isEnter } from '../../service/KeyHelper';
import ColouredResultBetColumn from './ColouredResultBetColumn';

import './StandingsTableRow.css';

class StandingsTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = { userDetailsPopoverAnchorEl: null, userDetailsPopoverOpen: false };
    this.showUserDetailsPopover = this.showUserDetailsPopover.bind(this);
    this.hideUserDetailsPopover = this.hideUserDetailsPopover.bind(this);
  }

  showUserDetailsPopover(e) {
    const { showUserInfoOnClick } = this.props;
    if (showUserInfoOnClick) {
      e.preventDefault();
      this.setState({ userDetailsPopoverOpen: true, userDetailsPopoverAnchorEl: e.currentTarget });
    }
  }

  hideUserDetailsPopover() {
    this.setState({ userDetailsPopoverOpen: false });
  }

  render() {
    const { userDetailsPopoverAnchorEl, userDetailsPopoverOpen } = this.state;
    const {
      bet,
      betColumnStyle,
      noDifferenz,
      noNiete,
      noRemisTendenz,
      noTendenz,
      points,
      rank,
      rowHeight,
      self,
      showBetColumn,
      showStatsColumns,
      showUserAvatar,
      showUserInfoOnClick,
      userAvatar,
      userId,
      username,
    } = this.props;

    return (
      <Fragment>
        <TableRow
          hover
          style={{ height: rowHeight }}
          className={`StandingsTableRow ${self ? 'StandingsTableRow--self' : null}`}
        >
          <TableCell style={{ ...baseRankColumnStyle, height: rowHeight }}>
            {rank}
          </TableCell>
          <TableCell style={{ height: rowHeight, padding: 0 }}>
            <div
              role={showUserInfoOnClick ? 'button' : null}
              className="TableRowColumn__user-wrapper"
              tabIndex={showUserInfoOnClick ? 0 : null}
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
                anchorEl={userDetailsPopoverAnchorEl}
                avatar={userAvatar}
                userId={userId}
                username={username}
                open={userDetailsPopoverOpen}
                onClose={this.hideUserDetailsPopover}
              />

              {showUserAvatar && (
                <UserAvatar
                  img={userAvatar}
                  size={0.65 * rowHeight}
                  username={username}
                  style={{ marginRight: '10px', minWidth: 0.65 * rowHeight }}
                />
              )}
              <span
                className={`TableRowColumn__${rowHeight < 55 ? 'username' : 'username--multi-line'}`}
                style={{ maxHeight: 0.65 * rowHeight }}
              >
                {username}
              </span>
            </div>
          </TableCell>

          {showBetColumn && (
            <ColouredResultBetColumn
              bet={bet}
              style={{
                ...betColumnStyle,
                height: rowHeight,
                fontSize: '16px',
              }}
            />
          )}

          {showStatsColumns && (
            <Fragment>
              <TableCell style={baseBetStatColumnStyle}>{this.props.noVolltreffer}</TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={baseBetStatColumnStyle}
              >
                {noDifferenz}
              </TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={baseBetStatColumnStyle}
              >
                {noRemisTendenz}
              </TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={baseBetStatColumnStyle}
              >
                {noTendenz}
              </TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={baseBetStatColumnStyle}
              >
                {noNiete}
              </TableCell>
            </Fragment>
          )}

          <TableCell style={{ ...basePointsColumnStyle, height: rowHeight }}>{points}</TableCell>
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
  showUserAvatar: true,
  showUserInfoOnClick: true,
  betColumnStyle: {},
};

StandingsTableRow.propTypes = {
  rank: PropTypes.string,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  userAvatar: PropTypes.string,
  points: PropTypes.number.isRequired,
  noVolltreffer: PropTypes.number.isRequired,
  noDifferenz: PropTypes.number.isRequired,
  noRemisTendenz: PropTypes.number.isRequired,
  noTendenz: PropTypes.number.isRequired,
  noNiete: PropTypes.number.isRequired,
  bet: PropTypes.object,

  self: PropTypes.bool,
  rowHeight: PropTypes.number.isRequired,
  showBetColumn: PropTypes.bool,
  showStatsColumns: PropTypes.bool,
  showUserAvatar: PropTypes.bool,
  showUserInfoOnClick: PropTypes.bool,
  betColumnStyle: PropTypes.object,
};

export default StandingsTableRow;
