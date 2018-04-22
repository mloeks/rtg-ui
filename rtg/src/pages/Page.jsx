import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header/Header';
import Footer from '../components/Footer';
import UserDetailsProvider from '../components/providers/UserDetailsProvider';

import './Page.css';

const Page = props => (
  <main className="Page">
    <UserDetailsProvider>
      <Header />
      <section className="Page__content">
        {props.children}
      </section>
      <Footer />
    </UserDetailsProvider>
  </main>
);

Page.propTypes = { children: PropTypes.node };
Page.defaultProps = { children: null };

export default Page;
