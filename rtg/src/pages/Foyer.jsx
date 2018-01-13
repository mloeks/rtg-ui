import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Header from '../components/Header';
import authService from '../service/AuthService';

class Foyer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
    };

    this.login = this.login.bind(this);
    this.loginAsAdmin = this.loginAsAdmin.bind(this);
  }

  login() {
    authService.authenticate(false, () => {
      this.setState({ redirectToReferrer: true });
    });
  }

  loginAsAdmin() {
    authService.authenticate(true, () => {
      this.setState({ redirectToReferrer: true });
    });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/reception' } };

    if (this.state.redirectToReferrer) {
      return (<Redirect to={from} />);
    }

    return (
      <div>
        <Header />
        <h3>RTG Foyer ...</h3>
        <RaisedButton label="Eintreten" onClick={this.login} />
        <RaisedButton label="Ich bin die Königin!" onClick={this.loginAsAdmin} />
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
