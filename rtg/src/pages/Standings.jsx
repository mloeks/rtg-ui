import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import StandingsTable from '../components/standings/StandingsTable';

import headingImg from '../theme/img/headings/mountain_pitch.jpg';
import './Standings.css';

const Standings = () => (
  <Page className="StandingsPage">
    <BigPicture className="StandingsPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Spielstand</h1>
    </BigPicture>

    <section className="StandingsPage__content">
      <StandingsTable />
    </section>
  </Page>
);

export default Standings;
