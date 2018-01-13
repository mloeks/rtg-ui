import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Header from '../components/Header';

const Bets = (props) => (
  <div>
    <Header />
    <h3>Deine Tipps! ...</h3>
    <h4 style={{ color: props.muiTheme.palette.textColor }}>Coole Farbe!</h4>
  </div>
);

Bets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Bets);
