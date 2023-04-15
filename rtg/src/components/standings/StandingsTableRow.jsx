import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import UserAvatar from '../UserAvatar';
import UserDetailsPopover from '../UserDetailsPopover';
import isEnter from '../../service/KeyHelper';
import ColouredResultBetColumn from './ColouredResultBetColumn';

import './StandingsTableRow.scss';

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
    this.setState({ userDetailsPopoverOpen: false, userDetailsPopoverAnchorEl: null });
  }

  render() {
    const { userDetailsPopoverAnchorEl, userDetailsPopoverOpen } = this.state;
    const {
      bet,
      betColumnStyle,
      betStatColumnStyle,
      noDifferenz,
      noNiete,
      noRemisTendenz,
      noTendenz,
      noVolltreffer,
      points,
      pointsColumnStyle,
      rank,
      rankColumnStyle,
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
      <>
        {userDetailsPopoverOpen && userDetailsPopoverAnchorEl && (
          <UserDetailsPopover
            anchorEl={userDetailsPopoverAnchorEl}
            avatar={userAvatar}
            userId={userId}
            username={username}
            onClose={this.hideUserDetailsPopover}
          />
        )}

        <TableRow
          hover
          style={{ height: rowHeight }}
          className={`StandingsTableRow ${self ? 'StandingsTableRow--self' : null}`}
        >
          <TableCell style={{ ...rankColumnStyle, height: rowHeight }}>
            {rank}
          </TableCell>
          <TableCell style={{ height: rowHeight, padding: 0 }}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              role={showUserInfoOnClick ? 'button' : null}
              className="TableRowColumn__user-wrapper"
              onClick={this.showUserDetailsPopover}
              onKeyPress={(e) => (isEnter(e) && this.showUserDetailsPopover(e))}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px',
                paddingLeft: 0,
              }}
            >
              {showUserAvatar && (
                <UserAvatar
                  img={userAvatar}
                  size={0.65 * rowHeight}
                  username={username}
                  style={{ marginRight: '10px', minWidth: 0.65 * rowHeight }}
                />
              )}
              <span className="TableRowColumn__username">
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
            <>
              <TableCell style={betStatColumnStyle}>{noVolltreffer}</TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={betStatColumnStyle}
              >
                {noDifferenz}
              </TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={betStatColumnStyle}
              >
                {noRemisTendenz}
              </TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={betStatColumnStyle}
              >
                {noTendenz}
              </TableCell>
              <TableCell
                className="StandingsTable__stat-col-desktop"
                style={betStatColumnStyle}
              >
                {noNiete}
              </TableCell>
            </>
          )}

          <TableCell style={{ ...pointsColumnStyle, height: rowHeight }}>{points}</TableCell>
        </TableRow>
      </>
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
  betStatColumnStyle: {},
  pointsColumnStyle: {},
  rankColumnStyle: {},
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
  bet: PropTypes.shape({
    result_bet: PropTypes.string,
    result_bet_type: PropTypes.string,
    points: PropTypes.number,
  }),

  self: PropTypes.bool,
  rowHeight: PropTypes.number.isRequired,
  showBetColumn: PropTypes.bool,
  showStatsColumns: PropTypes.bool,
  showUserAvatar: PropTypes.bool,
  showUserInfoOnClick: PropTypes.bool,

  betColumnStyle: stylePropType,
  betStatColumnStyle: stylePropType,
  pointsColumnStyle: stylePropType,
  rankColumnStyle: stylePropType,
};

export default StandingsTableRow;
