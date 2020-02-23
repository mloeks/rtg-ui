import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import StandingsTable from '../components/standings/StandingsTable';

import headingImg from '../theme/img/headings/mountain_pitch.jpg';
import './Standings.scss';

const Standings = () => (
  <Page className="StandingsPage">
    <BigPicture className="StandingsPage__heading" img={headingImg}>
      <h2 className="BigPicture__heading">Spielstand</h2>
    </BigPicture>

    <section className="StandingsPage__content">
      <StandingsTable />
    </section>
  </Page>
);

export default Standings;
