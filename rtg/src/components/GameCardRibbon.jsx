import React from 'react';
import PropTypes from 'prop-types';

import './GameCardRibbon.css';

const GameCardRibbon = props => (
  <div className={`GameCardRibbon ${props.state}`}>
    <div className="GameCardRibbon__content">
      {props.kickoff && <div className="GameCardRibbon__kickoff">{props.kickoff}</div>}
      {props.city && <div className="GameCardRibbon__city">{props.city}</div>}
    </div>
    <div className="GameCardRibbon__right" />
  </div>
);

GameCardRibbon.defaultProps = {
  state: 'neutral',
  kickoff: null,
  city: null,
};

GameCardRibbon.propTypes = {
  state: PropTypes.string,
  kickoff: PropTypes.string,
  city: PropTypes.string,
};

export default GameCardRibbon;
