import React from 'react';
import PropTypes from 'prop-types';
import { parse } from 'date-fns';
import CountryFlag from './CountryFlag';
import GameCardGameInfo from './GameCardGameInfo';

import './GameCard.css';

// TODO P1 add the possibility to display user bet for not-yet-started games
const GameCard = (props) => {
  const centerContent = props.children || (
    // if no other children are passed in,
    // display the usual read-only information about the game per default
    <GameCardGameInfo
      city={props.city}
      kickoff={parse(props.kickoff)}
      result={props.homegoals !== -1 && props.awaygoals !== -1 ? `${props.homegoals} - ${props.awaygoals}` : null}
    />
  );
  return (
    <section className="GameCard">
      <CountryFlag country={props.hometeam_name} countryCode={props.hometeam_abbreviation} />
      <div className="hometeam">{props.hometeam_name}</div>
      {centerContent}
      <div className="awayteam">{props.awayteam_name}</div>
      <CountryFlag country={props.awayteam_name} countryCode={props.awayteam_abbreviation} />
    </section>);
};

GameCard.defaultProps = {
  group: null,
  children: null,
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

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default GameCard;
