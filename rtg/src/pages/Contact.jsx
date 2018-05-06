import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import ContactForm from '../components/contact/ContactForm';

import headingImg from '../theme/img/headings/aisle_chairs.jpg';

const Contact = () => (
  <Page className="ContactPage">
    <BigPicture className="ContactPage__heading" img={headingImg}>
      <h1 className="BigPicture__heading">Kontakt</h1>
    </BigPicture>
    <ContactForm />
  </Page>
);

export default Contact;
