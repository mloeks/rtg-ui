import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';

// TODO P1 implement
const Imprint = () => (
  <Page className="ImprintPage">
    <BigPicture className="ImprintPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Impressum</h1>
    </BigPicture>
    {/* Icons von hier: https://www.shareicon.net/pack/flat-round-world-flag-icon-set */}
    {/* https://materialdesignicons.com/ */}
  </Page>
);

export default Imprint;
