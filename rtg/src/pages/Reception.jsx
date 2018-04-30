import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Page from './Page';
import LoginForm from '../components/LoginForm';
import AuthService from '../service/AuthService';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img1.jpg';
import './Reception.css';

class Reception extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
    };

    this.login = this.login.bind(this);
  }

  componentDidMount() {
    if (!AuthService.isAuthenticated()) {
      // make sure a non-authenticated user always has a clean slate...
      AuthService.resetProps();
    }
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
          <div className="ReceptionPage__about">
            <h3>Über die RTG</h3>
            <p>
              Die Royale Tippgemeinschaft ist ein alle zwei Jahre zur Fußball-WM oder EM
              stattfindendes Tippspiel, welches vom Royalen Paar (Dorothee von Schweden und
              ihrem Prinzgemahl Matthias) organisiert wird. Es wendet sich an alle Freunde,
              Bekannte, Kollegen und Familienmitglieder der Organisatoren.
            </p>
            <p>
              Stetig wächst die Gruppe der RTG, die Mitglieder sind nicht nur
              in ganz Deutschland sondern mittlerweile auch in der ganzen Welt verteilt.
              Wenn Du mit dem Royalen Paar bekannt bist, fühl Dich herzlich eingeladen,
              an diesem wunderbaren und hochroyalen Spaß teilzuhaben!
            </p>
          </div>
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
