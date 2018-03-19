import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Page from './Page';
import LoginForm from '../components/LoginForm';
import AuthService from '../service/AuthService';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';
import './Reception.css';

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
        <BigPicture className="ReceptionPage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Willkommen</h1>
        </BigPicture>
        <section className="ReceptionPage__content">
          <LoginForm onLogin={this.login} />
        </section>
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
