import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';

const About = () => (
  <Page className="AboutPage">
    <BigPicture className="AboutPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Über die RTG</h1>
    </BigPicture>
  </Page>
);

export default About;
