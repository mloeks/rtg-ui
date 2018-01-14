import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';

const Bets = props => (
  <div>
    <h3>Deine Tipps! ...</h3>
    <h4 style={{ color: props.muiTheme.palette.textColor }}>Coole Farbe!</h4>
  </div>
);

Bets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Bets);
