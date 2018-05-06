import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import News from '../components/news/News';

import headingImg from '../theme/img/headings/courtyard_2.jpg';
import './Foyer.css';

const Foyer = () => (
  <Page className="FoyerPage">
    <BigPicture className="Foyer__welcome" img={headingImg}>
      <h1 className="BigPicture__heading">Neuigkeiten</h1>
    </BigPicture>
    <News />
  </Page>
);

export default Foyer;
