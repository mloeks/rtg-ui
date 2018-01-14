import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import AuthService from '../service/AuthService';

class Foyer extends Component {
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
    const { from } = this.props.location.state || { from: { pathname: '/reception' } };

    if (this.state.redirectToReferrer) {
      return (<Redirect to={from} />);
    }

    return (
      <div>
        <Header />
        <LoginForm onLogin={this.login} />
      </div>);
  }
}

Foyer.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default Foyer;
