import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/headings/my/ancient_clocks.webp';

const AdminGameResults = () => (
  <Page className="AdminGameResultsPage">
    <BigPicture img={headingImg} positionY="30">
      <h2 className="BigPicture__heading">Ergebnisse eintragen</h2>
    </BigPicture>
    <section className="AdminGameResultsPage__content">
      TODO :-)
    </section>
  </Page>
);

export default AdminGameResults;
