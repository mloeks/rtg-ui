import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';

// TODO P1 implement
const Rules = () => (
  <Page className="RulesPage">
    <BigPicture className="RulesPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Spielregeln</h1>
    </BigPicture>
  </Page>
);

export default Rules;
