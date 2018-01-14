import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Page from './Page';
import LoginForm from '../components/LoginForm';
import AuthService from '../service/AuthService';

class Reception extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
    };

    this.login = this.login.bind(this);
  }

  login(username, password, errorCallback) {
    AuthService.authenticate(username, password)
      .then(() => {
        this.setState({ redirectToReferrer: true });
      })
      .catch(errorCallback);
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/foyer' } };

    if (this.state.redirectToReferrer || AuthService.isAuthenticated()) {
      return (<Redirect to={from} />);
    }

    return (
      <Page className="ReceptionPage">
        <LoginForm onLogin={this.login} />
      </Page>);
  }
}

Reception.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default Reception;
