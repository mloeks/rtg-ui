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

import newsHeadingImg from '../theme/img/headings/my/central_windsor_courtyard.webp';
import betsHeadingImg from '../theme/img/headings/my/ancient_clocks.webp';
import scheduleHeadingImg from '../theme/img/headings/my/books_of_queen_victoria.webp';
import './Foyer.scss';

// TODO P3 make each BigPicture sticky (less high when sticky)
const Foyer = () => (
  <Page className="Foyer">
    {!AuthService.getLastLogin() && (
      <Notification
        className="Foyer__first-visit qa-first-visit-notification"
        containerStyle={{ position: 'fixed' }}
        dismissable
        disappearAfterMs={5000}
        type={NotificationType.SUCCESS}
        title="Anmeldung erfolgreich"
        subtitle="Viel Spaß und Erfolg bei der diesjährigen RTG!"
      />
    )}

    <div className="Foyer__standings">
      <StandingsOverview />
      <CurrentGames />
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
      positionY={40}
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
