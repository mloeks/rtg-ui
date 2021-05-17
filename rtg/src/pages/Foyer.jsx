import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import News from '../components/news/News';
import AuthService from '../service/AuthService';
import BetsOverview from '../components/foyer/BetsOverview';
import ScheduleOverview from '../components/foyer/ScheduleOverview';
import StandingsOverview from '../components/foyer/StandingsOverview';
import Notification, { NotificationType } from '../components/Notification';
import CurrentGames from '../components/currentgames/CurrentGames';

import newsHeadingImg from '../theme/img/headings/courtyard_2.jpg';
import betsHeadingImg from '../theme/img/headings/royals_stadium.jpg';
import scheduleHeadingImg from '../theme/img/headings/cup_and_ball.jpg';
import './Foyer.scss';

// TODO P3 make each BigPicture sticky (less high when sticky)
const Foyer = () => (
  <Page className="Foyer">
    {!AuthService.getLastLogin() && (
      <Notification
        className="Foyer__first-visit qa-first-visit-notification"
        containerStyle={{ position: 'fixed' }}
        dismissable
        disappearAfterMs="5000"
        type={NotificationType.SUCCESS}
        title="Anmeldung erfolgreich"
        subtitle="Viel Spaß und Erfolg bei der diesjährigen RTG!"
      />
    )}

    <div className="Foyer__standings">
      <CurrentGames />
      <StandingsOverview />
    </div>

    <BigPicture
      className="Foyer__news"
      img={newsHeadingImg}
      lazyLoadWhenInViewport
    >
      <h2 className="BigPicture__heading">Neuigkeiten</h2>
    </BigPicture>
    <News />

    <BigPicture
      className="Foyer__bets-overview"
      img={betsHeadingImg}
      positionY={25}
      lazyLoadWhenInViewport
    >
      <h2 className="BigPicture__heading">Tippabgabe</h2>
    </BigPicture>
    <BetsOverview />

    <BigPicture
      className="Foyer__schedule-overview"
      img={scheduleHeadingImg}
      lazyLoadWhenInViewport
    >
      <h2 className="BigPicture__heading">Spielplan</h2>
    </BigPicture>
    <ScheduleOverview />
  </Page>
);

export default Foyer;
