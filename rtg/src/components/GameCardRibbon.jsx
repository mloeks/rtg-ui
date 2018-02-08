import React from 'react';

import './GameCardRibbon.css';

const GameCardRibbon = () => (
  <div className="GameCardRibbon success">
    <div className="GameCardRibbon__content">
      <div className="GameCardRibbon__kickoff">16:00</div>
      <div className="GameCardRibbon__venue">St. Petersburg</div>
    </div>
    <div className="GameCardRibbon__right" />
  </div>
);

GameCardRibbon.propTypes = {};

export default GameCardRibbon;
