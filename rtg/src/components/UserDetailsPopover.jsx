import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, IconButton, Popover } from 'material-ui';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import Close from 'material-ui/svg-icons/navigation/close';
import UserAvatar from './UserAvatar';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import { darkGrey, grey } from '../theme/RtgTheme';

import './UserDetailsPopover.css';

// TODO P2 also load statistics and offer to show rank, bet stats etc. to other users
class UserDetailsPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      detailsLoading: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.loadDetails();
    }
  }

  async loadDetails() {
    fetch(`${API_BASE_URL}/rtg/users_public/${this.props.userId}/`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then(response => (
      this.setState({
        detailsLoading: false, ...response.ok && { user: response.json },
      })
    )).catch(() => this.setState({ detailsLoading: false }));
  }

  render() {
    return (
      <Popover
        animated={false}
        anchorEl={this.props.anchorEl}
        anchorOrigin={this.props.anchorOrigin}
        onRequestClose={this.props.onClose}
        open={this.props.open}
        targetOrigin={this.props.targetOrigin}
        style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      >
        <div className="UserDetailsPopover">
          <div className="UserDetailsPopover__content">
            <div className="UserDetailsPopover__avatar-wrapper">
              <div className="UserDetailsPopover__avatar-background">
                <UserAvatar
                  className="UserDetailsPopover__avatar"
                  size={130}
                  username={this.props.username}
                  img={this.props.avatar}
                />
              </div>
            </div>

            <IconButton
              className="UserDetailsPopover__close-icon"
              onClick={this.props.onClose}
              title="Schließen"
              style={{ position: 'absolute', top: 0, right: 0 }}
              iconStyle={{ color: darkGrey, width: 18, height: 18 }}
            ><Close />
            </IconButton>

            <h3 className="UserDetailsPopover__username">{this.props.username}</h3>

            {this.state.detailsLoading && <CircularProgress />}

            {!this.state.detailsLoading && this.state.user && (
              <div className="UserDetailsPopover__details">
                {this.state.user.about &&
                  <p className="UserDetailsPopover__about">
                    »&nbsp;{this.state.user.about}&nbsp;«
                  </p>}
                {this.state.user.location &&
                  <p className="UserDetailsPopover__location">
                    <MapsPlace style={{ color: grey, width: '18px', height: '18px' }}/>&nbsp;
                    {this.state.user.location}
                  </p>}
              </div>
            )}
          </div>
        </div>
      </Popover>
    );
  }
}

UserDetailsPopover.defaultProps = {
  anchorEl: null,
  avatar: null,
  anchorOrigin: { horizontal: 'left', vertical: 'top' },
  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
};

UserDetailsPopover.propTypes = {
  anchorEl: PropTypes.object,
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.string.isRequired,
    vertical: PropTypes.string.isRequired,
  }),
  targetOrigin: PropTypes.shape({
    horizontal: PropTypes.string.isRequired,
    vertical: PropTypes.string.isRequired,
  }),
  avatar: PropTypes.string,
  open: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,
};

export default UserDetailsPopover;
