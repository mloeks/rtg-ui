import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';

export const UserDetailsContext = React.createContext();

const LogoutReason = {
  USER_DETAILS_LOAD_ERROR: 'USER_DETAILS_LOAD_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
};

class UserDetailsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      doLogout: this.handleLogout.bind(this),
    };
  }

  // TODO P1 use user info from local storage for state and also update on refresh token
  // instead of fetching the user every time
  componentDidMount() {
    if (AuthService.isAuthenticated()) {
      this.fetchUserDetails();
    }
  }

  handleLogout(reason) {
    // TODO P2 set URL parameter if reason is set and render info message on login page
    AuthService.logout().then(() => this.props.history.push('/'));
  }

  fetchUserDetails() {
    fetch(`${API_BASE_URL}/rtg/users/${AuthService.getUserId()}/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          this.setState({ user: response.json });
        } else {
          this.handleLogout(LogoutReason.USER_DETAILS_LOAD_ERROR);
        }
      }).catch(() => this.handleLogout(LogoutReason.USER_DETAILS_LOAD_ERROR));
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
