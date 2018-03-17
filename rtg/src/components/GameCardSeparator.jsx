import React from 'react';
import PropTypes from 'prop-types';

import './GameCardSeparator.css';

const GameCardSeparator = props => (
  <div className="GameCardSeparator">
    <div className="GameCardSeparator__text">
      {props.content}
    </div>
  </div>
);

GameCardSeparator.propTypes = {
  content: PropTypes.node.isRequired,
};

export default GameCardSeparator;
