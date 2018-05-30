import React from 'react';
import GameCardRibbon from './GameCardRibbon';

import './GameCard.css';
import './CountryFlag.css';

// TODO P2 also use this on the schedule and bets page instead of loading spinner
const NullGameCard = () => (
  <section className="GameCard GameCard--skeleton">
    <div className="CountryFlag CountryFlag--skeleton" />
    <GameCardRibbon stateCssClass="skeleton" />
    <div className="CountryFlag CountryFlag--skeleton" />
  </section>
);

export default NullGameCard;
