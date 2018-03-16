import React from 'react';
import PropTypes from 'prop-types';
import { parse } from 'date-fns';
import CountryFlag from './CountryFlag';
import GameCardRibbon from './GameCardRibbon';

import './GameCard.css';

const GameCard = (props) => {
  const kickoffDate = parse(props.kickoff);

  return (
    <section className="GameCard">
      <CountryFlag country={props.hometeam_name} countryCode="GER" />
      <div className="hometeam">{props.hometeam_name}</div>

      {/* TODO fetch user bet and points if result is there and pass them in */}
      <GameCardRibbon
        city={props.city}
        kickoff={kickoffDate}
        result={props.homegoals !== -1 && props.awaygoals !== -1 ? `${props.homegoals} - ${props.awaygoals}` : null}
      />

      <div className="awayteam">{props.awayteam_name}</div>
      <CountryFlag country={props.awayteam_name} countryCode="SWE" />
    </section>);
};

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
