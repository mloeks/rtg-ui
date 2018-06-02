/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AuthService from '../../service/AuthService';

export const UserDetailsContext = React.createContext();

export const LogoutReason = {
  USER_DETAILS_LOAD_ERROR: 'USER_DETAILS_LOAD_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
};

class UserDetailsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isAuthenticated: false,
      isAdmin: false,
      userId: null,
      username: null,
      avatar: null,
      openBetsCount: null,

      doLogout: this.handleLogout.bind(this),
      updateAvatar: this.handleUpdateAvatar.bind(this),
      updateOpenBetsCount: this.handleOpenBetsCount.bind(this),
    };
  }

  componentDidMount() {
    if (AuthService.isAuthenticated()) {
      this.setUserFromAuthInformation();
    }
  }

  setUserFromAuthInformation() {
    this.setState({
      isAuthenticated: AuthService.isAuthenticated(),
      isAdmin: AuthService.isAdmin(),
      userId: AuthService.getUserId(),
      username: AuthService.getUsername(),
      avatar: AuthService.getAvatar(),
      hasPaid: AuthService.getHasPaid(),
      openBetsCount: AuthService.getOpenBetsCount(),
    });
  }

  handleLogout(reason) {
    // TODO P2 set URL parameter if reason is set and render info message on login page
    // especially important as confirmation on account deletion!
    AuthService.logout().then(() => this.props.history.push('/'));
  }

  handleUpdateAvatar(avatar) {
    AuthService.setAvatar(avatar);
    this.setState({ avatar });
  }

  handleOpenBetsCount(openBetsCount) {
    AuthService.setOpenBetsCount(openBetsCount);
    this.setState({ openBetsCount });
  }

  render() {
    return (
      <UserDetailsContext.Provider value={this.state}>
        {this.props.children}
      </UserDetailsContext.Provider>
    );
  }
}

UserDetailsProvider.defaultProps = {
  children: null,
};

UserDetailsProvider.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(UserDetailsProvider);
