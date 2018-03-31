import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';

// TODO P1 implement
const Donate = () => (
  <Page className="DonatePage">
    <BigPicture className="DonatePage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Spenden</h1>
    </BigPicture>
  </Page>
);

export default Donate;
