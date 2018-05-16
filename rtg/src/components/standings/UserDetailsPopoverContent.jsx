import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '../UserAvatar';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';

import './UserDetailsPopoverContent.css';
import { CircularProgress } from "material-ui";

class UserDetailsPopoverContent extends Component {
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
      <div className="UserDetailsPopover">
        <UserAvatar size={130} username={this.props.username} img={this.props.avatar} />
        <div className="UserDetailsPopover__content">
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
    );
  }
}

UserDetailsPopoverContent.defaultProps = { avatar: null };

UserDetailsPopoverContent.propTypes = {
  avatar: PropTypes.string,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,
};

export default UserDetailsPopoverContent;
