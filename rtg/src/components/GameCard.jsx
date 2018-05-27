import React from 'react';
import PropTypes from 'prop-types';
import CountryFlag from './CountryFlag';

import './GameCard.css';

// TODO P2 FEATURE Prio 2 - add possibility to unfold and show calculated bet stats below the card
const GameCard = props => (
  <section className="GameCard">
    <CountryFlag country={props.hometeam_name} countryCode={props.hometeam_abbreviation} />
    <div className="hometeam">{props.hometeam_name}</div>
    {props.children}
    <div className="awayteam">{props.awayteam_name}</div>
    <CountryFlag country={props.awayteam_name} countryCode={props.awayteam_abbreviation} />
  </section>
);

GameCard.defaultProps = { children: null };

GameCard.propTypes = {
  hometeam_name: PropTypes.string.isRequired,
  hometeam_abbreviation: PropTypes.string.isRequired,
  awayteam_name: PropTypes.string.isRequired,
  awayteam_abbreviation: PropTypes.string.isRequired,

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default GameCard;
