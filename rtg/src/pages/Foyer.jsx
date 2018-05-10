import React, { Fragment } from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import News from '../components/news/News';
import { UserDetailsContext } from '../components/providers/UserDetailsProvider';

import logo from '../theme/img/logo_100px.png';
import headingImg from '../theme/img/headings/courtyard_2.jpg';
import './Foyer.css';

const Foyer = () => (
  <Page className="FoyerPage">
    <section className="Foyer__welcome">
      <UserDetailsContext.Consumer>
        {userContext => (
          <Fragment>
            <img className="Foyer__top-logo" src={logo} alt="RTG Logo" /><br />
            <h3 className="Foyer__greeting">Herzlich Willkommen, {userContext.username}!</h3>
          </Fragment>
        )}
      </UserDetailsContext.Consumer>
    </section>
    <BigPicture className="Foyer__news" img={headingImg}>
      <h1 className="BigPicture__heading">Neuigkeiten</h1>
    </BigPicture>
    <News />
  </Page>
);

export default Foyer;
