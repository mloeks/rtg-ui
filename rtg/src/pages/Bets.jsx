import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Bets = props => (
  <main className="content">
    <Header />
    <section className="page-content">
      <h3>Deine Tipps! ...</h3>
      <h4 style={{ color: props.muiTheme.palette.textColor }}>Coole Farbe!</h4>
    </section>
    <Footer />
  </main>
);

Bets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Bets);
