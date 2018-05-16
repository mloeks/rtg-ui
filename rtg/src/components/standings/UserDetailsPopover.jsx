import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, IconButton, Popover } from 'material-ui';
import Close from 'material-ui/svg-icons/navigation/close';
import UserAvatar from '../UserAvatar';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';

import './UserDetailsPopover.css';

// TODO P2 when appearing, it is displayed in the top left viewport corner for
// a very short moment
class UserDetailsPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      detailsLoading: true,
    };
  }

  componentDidMount() {
    this.loadDetails();
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
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
        onRequestClose={this.props.onClose}
      >
        <div className="UserDetailsPopover">
          <UserAvatar size={130} username={this.props.username} img={this.props.avatar} />
          <div className="UserDetailsPopover__content">
            <IconButton onClick={this.props.onClose}><Close /></IconButton>

            <h3 className="UserDetailsPopover__username">{this.props.username}</h3>

            {this.state.detailsLoading && <CircularProgress />}
            {!this.state.detailsLoading && this.state.user && (
              <div className="UserDetailsPopover__details">
                <span>{this.state.user.about}</span>
                <span>{this.state.user.location}</span>
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
  anchorOrigin: { horizontal: 'middle', vertical: 'bottom' },
  targetOrigin: { horizontal: 'middle', vertical: 'bottom' },
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
