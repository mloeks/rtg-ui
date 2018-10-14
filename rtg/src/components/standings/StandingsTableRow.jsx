import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
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
      <Fragment>
        <UserDetailsPopover
          anchorEl={userDetailsPopoverAnchorEl}
          avatar={userAvatar}
          userId={userId}
          username={username}
          open={userDetailsPopoverOpen}
          onClose={this.hideUserDetailsPopover}
        />

        <TableRow
          hover
          style={{ height: rowHeight }}
          className={`StandingsTableRow ${self ? 'StandingsTableRow--self' : null}`}
        >
          <TableCell style={{ ...rankColumnStyle, height: rowHeight }}>
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
            </Fragment>
          )}

          <TableCell style={{ ...pointsColumnStyle, height: rowHeight }}>{points}</TableCell>
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
  bet: PropTypes.object,

  self: PropTypes.bool,
  rowHeight: PropTypes.number.isRequired,
  showBetColumn: PropTypes.bool,
  showStatsColumns: PropTypes.bool,
  showUserAvatar: PropTypes.bool,
  showUserInfoOnClick: PropTypes.bool,

  /* eslint-disable react/forbid-prop-types */
  betColumnStyle: PropTypes.object,
  betStatColumnStyle: PropTypes.object,
  pointsColumnStyle: PropTypes.object,
  rankColumnStyle: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
};

export default StandingsTableRow;
