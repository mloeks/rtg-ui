import React from 'react';
import PropTypes from 'prop-types';

import './GameCardRibbon.css';

const GameCardRibbon = ({ children, stateCssClass }) => (
  <div className={`GameCardRibbon ${stateCssClass}`}>
    <div className="GameCardRibbon__content">{children}</div>
    <div className="GameCardRibbon__right" />
  </div>
);

GameCardRibbon.defaultProps = {
  children: null,
};

GameCardRibbon.propTypes = {
  stateCssClass: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default GameCardRibbon;
