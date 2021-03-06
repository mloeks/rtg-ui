import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterProptypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import AuthService from '../../service/AuthService';

export const UserDetailsContext = React.createContext();

export const LogoutReason = {
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
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

  handleLogout(reason) {
    const { history } = this.props;
    AuthService.logout().then(() => history.push(`/login${reason ? `/${reason}` : ''}`));
  }

  handleUpdateAvatar(avatar) {
    AuthService.setAvatar(avatar);
    this.setState({ avatar });
  }

  handleOpenBetsCount(openBetsCount) {
    AuthService.setOpenBetsCount(openBetsCount);
    this.setState({ openBetsCount });
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

  render() {
    const { children } = this.props;
    const {
      isAuthenticated,
      isAdmin,
      userId,
      username,
      avatar,
      hasPaid,
      openBetsCount,
      doLogout,
      updateAvatar,
      updateOpenBetsCount,
    } = this.state;

    return (
      <UserDetailsContext.Provider value={{
        isAuthenticated,
        isAdmin,
        userId,
        username,
        avatar,
        hasPaid,
        openBetsCount,
        doLogout,
        updateAvatar,
        updateOpenBetsCount,
      }}
      >
        {children}
      </UserDetailsContext.Provider>
    );
  }
}

UserDetailsProvider.defaultProps = {
  children: null,
};

UserDetailsProvider.propTypes = {
  children: PropTypes.node,
  history: ReactRouterProptypes.history.isRequired,
};

export default withRouter(UserDetailsProvider);
