import React from 'react';
import GameCardRibbon from './GameCardRibbon';

import './GameCard.scss';
import './CountryFlag.scss';

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
