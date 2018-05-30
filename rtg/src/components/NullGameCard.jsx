import React from 'react';
import GameCardRibbon from './GameCardRibbon';

import './GameCard.css';
import './CountryFlag.css';

// TODO P2 also use this on the schedule and bets page instead of loading spinner
const NullGameCard = () => (
  <section className="GameCard">
    <div className="GameCard__inner GameCard__inner--skeleton">
      <div className="CountryFlag CountryFlag--skeleton" />
      <GameCardRibbon stateCssClass="skeleton" />
      <div className="CountryFlag CountryFlag--skeleton" />
    </div>
  </section>
);

export default NullGameCard;
