import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';

import './Page.css';

const Page = (props) => (
  <main className="Page">
    <Header />
    <section className="Page__content">
      {props.children}
    </section>
    <Footer />
  </main>
);

Page.propTypes = { children: PropTypes.node };
Page.defaultProps = { children: null };

export default Page;
