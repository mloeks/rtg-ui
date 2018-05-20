import React, { Fragment } from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import News from '../components/news/News';
import { UserDetailsContext } from '../components/providers/UserDetailsProvider';
import AuthService from '../service/AuthService';
import BetsOverview from '../components/foyer/BetsOverview';
import ScheduleOverview from '../components/foyer/ScheduleOverview';
import Notification, { NotificationType } from '../components/Notification';

import logo from '../theme/img/logo_100px.png';
import newsHeadingImg from '../theme/img/headings/courtyard_2.jpg';
import betsHeadingImg from '../theme/img/headings/royals_stadium.jpg';
import scheduleHeadingImg from '../theme/img/headings/cup_and_ball.jpg';
import standingsHeadingImg from '../theme/img/headings/mountain_pitch.jpg';
import './Foyer.css';

// TODO P1 add more BigPicture sections for introducing various available features/pages
// on scroll down
// TODO P3 make each BigPicture sticky (less high when sticky)
const Foyer = () => (
  <Page className="Foyer">
    <section className="Foyer__welcome">
      <UserDetailsContext.Consumer>
        {userContext => (
          <Fragment>
            <img className="Foyer__top-logo" src={logo} alt="RTG Logo" /><br />
            <h3 className="Foyer__greeting">Herzlich Willkommen, {userContext.username}!</h3>

            {!AuthService.getLastLogin() &&
              <Notification
                className="Foyer__first-visit"
                dismissable
                type={NotificationType.SUCCESS}
                title="Anmeldung erfolgreich"
                subtitle="Viel Spaß und Erfolg bei der diesjährigen RTG!"
              />}
          </Fragment>
        )}
      </UserDetailsContext.Consumer>
    </section>

    <BigPicture className="Foyer__news" img={newsHeadingImg}>
      <h1 className="BigPicture__heading">Neuigkeiten</h1>
    </BigPicture>
    <News />

    <BigPicture className="Foyer__bets-overview" img={betsHeadingImg} positionY={25}>
      <h1 className="BigPicture__heading">Tippabgabe</h1>
    </BigPicture>
    <BetsOverview />

    <BigPicture className="Foyer__schedule-overview" img={scheduleHeadingImg}>
      <h1 className="BigPicture__heading">Spielplan</h1>
    </BigPicture>
    <ScheduleOverview />

    <BigPicture className="Foyer__standings-overview" img={standingsHeadingImg}>
      <h1 className="BigPicture__heading">Aktueller Spielstand</h1>
    </BigPicture>
  </Page>
);

export default Foyer;
