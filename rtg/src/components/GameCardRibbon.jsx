import React from 'react';
import PropTypes from 'prop-types';

import './GameCardRibbon.css';

const GameCardRibbon = (props) => {
  return (
    <div className={`GameCardRibbon ${props.stateCssClass}`}>
      <div className="GameCardRibbon__content">
        {props.children}
      </div>
      <div className="GameCardRibbon__right" />
    </div>
  );
};

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
