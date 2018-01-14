import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Page from './Page';

const Bets = props => (
  <Page className="BetsPage">
    <h3>Deine Tipps! ...</h3>
    <h4 style={{ color: props.muiTheme.palette.textColor }}>Coole Farbe!</h4>
  </Page>
);

Bets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Bets);
