import React from 'react';
import PropTypes from 'prop-types';
import CountryFlag from './CountryFlag';
import GameCardRibbon from './GameCardRibbon';

import './GameCard.css';

const GameCard = props => (
  <section className="GameCard">
    <CountryFlag className="GameCard__flag GameCard__flag--home" countryCode="GER" />
    <div className="GameCard__hometeam GameCard__hometeam--full">{props.hometeam_name}</div>
    <div className="GameCard__hometeam GameCard__hometeam--abbreviation">
      {props.hometeam_abbreviation}
    </div>

    <GameCardRibbon />

    <div className="GameCard__awayteam GameCard__awayteam--full">{props.awayteam_name}</div>
    <div className="GameCard__awayteam GameCard__awayteam--abbreviation">
      {props.awayteam_abbreviation}
    </div>
    <CountryFlag className="GameCard__flag GameCard__flag--away" countryCode="SWE" />
  </section>
);

GameCard.defaultProps = {
  group: null,
};

GameCard.propTypes = {
  id: PropTypes.number.isRequired,
  kickoff: PropTypes.string.isRequired,
  deadline: PropTypes.string.isRequired,
  hometeam_name: PropTypes.string.isRequired,
  hometeam_abbreviation: PropTypes.string.isRequired,
  awayteam_name: PropTypes.string.isRequired,
  awayteam_abbreviation: PropTypes.string.isRequired,
  homegoals: PropTypes.number.isRequired,
  awaygoals: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  round_details: PropTypes.shape({
    name: PropTypes.string.isRequired,
    abbreviation: PropTypes.string.isRequired,
    is_knock_out: PropTypes.bool.isRequired,
  }).isRequired,
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    abbreviation: PropTypes.string.isRequired,
  }),
  bets_open: PropTypes.bool.isRequired,
};

export default GameCard;
