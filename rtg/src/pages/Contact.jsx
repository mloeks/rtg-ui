import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';

import headingImg from '../theme/img/img7.jpg';

const Contact = () => (
  <Page className="ContactPage">
    <BigPicture className="ContactPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Kontakt</h1>
    </BigPicture>
  </Page>
);

export default Contact;
