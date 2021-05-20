import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Page from './Page';
import LoginForm from '../components/LoginForm';
import AuthService from '../service/AuthService';
import BigPicture from '../components/BigPicture';
import { LogoutReason } from '../components/providers/UserDetailsProvider';
import Notification, { NotificationType } from '../components/Notification';

import headingImg from '../theme/img/headings/my/golden_fence_top_windsor.webp';
import './Reception.scss';

class Reception extends Component {
  static getReasonNotification(reason) {
    if (reason === LogoutReason.ACCOUNT_DELETED) {
      return (
        <Notification
          dismissable
          type={NotificationType.SUCCESS}
          title="Dein Account wurde gelöscht"
          subtitle="Auf Wiedersehen und alles Gute!"
          containerStyle={{ maxWidth: 400, margin: '20px auto' }}
        />
      );
    }
    return null;
  }

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
    const { redirectToReferrer } = this.state;
    const { location, match } = this.props;

    const { from } = location.state || { from: { pathname: '/foyer' } };

    if (redirectToReferrer || AuthService.isAuthenticated()) {
      return (<Redirect to={from} />);
    }

    const reasonToReLogin = match.params.reason;
    const userNotificationIfReasonPresent = Reception.getReasonNotification(reasonToReLogin);

    return (
      <Page className="ReceptionPage">
        {reasonToReLogin && userNotificationIfReasonPresent}
        <BigPicture className="ReceptionPage__heading" img={headingImg} positionY="30">
          <h2 className="BigPicture__heading qa-reception-greeting">Willkommen</h2>
        </BigPicture>
        <section className="ReceptionPage__content">
          <LoginForm onLogin={this.login} />
          <div className="ReceptionPage__about">
            <h3>Über die RTG</h3>
            <p>
              Die Royale Tippgemeinschaft ist ein alle zwei Jahre zur Fußball-WM oder EM
              stattfindendes Tippspiel, welches von der Royal Family (Dorothee von Schweden,
              ihrem Prinzgemahl Matthias und Kronprinz Jonathan Marius) organisiert wird.
              Es wendet sich an alle Freunde, Bekannte, Kollegen und Familienmitglieder der
              Organisatoren.
            </p>
            <p>
              Stetig wächst die RTG, deren Mitglieder mittlerweile nicht nur
              in ganz Deutschland, sondern auch in der ganzen Welt verteilt sind.
              Wenn Du mit dem Royalen Paar bekannt bist, fühl Dich herzlich eingeladen,
              an diesem wunderbaren und hochroyalen Spaß teilzuhaben!
            </p>
          </div>
        </section>
      </Page>
    );
  }
}

Reception.defaultProps = {
  match: {},
};

Reception.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
  match: PropTypes.shape(),
};

export default Reception;
