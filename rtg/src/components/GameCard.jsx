import React from 'react';
import PropTypes from 'prop-types';
import CountryFlag from './CountryFlag';

import './GameCard.css';

// TODO P2 FEATURE Prio 2 - add possibility to unfold and show calculated bet stats below the card
// TODO P3 move team name from CountryFlag in here and clean up name mode foo
const GameCard = (props) => {
  const mapDisplayTeamNameForCountryFlag = props.displayTeamNames === 'auto' ? 'auto' : 'always';

  return (
    <section
      className={`GameCard ${props.displayTeamNames === 'auto' ? 'auto-hide' : ''}`}
      style={props.style}
    >
      <div className="GameCard__inner">
        <CountryFlag
          country={props.hometeam_name}
          countryCode={props.hometeam_abbreviation}
          displayTeamName={mapDisplayTeamNameForCountryFlag}
        />

        <div className="hometeam">
          {props.displayTeamNames !== 'small' ? props.hometeam_name : ''}
        </div>

        {props.children}

        <div className="awayteam">
          {props.displayTeamNames !== 'small' ? props.awayteam_name : ''}
        </div>

        <CountryFlag
          country={props.awayteam_name}
          countryCode={props.awayteam_abbreviation}
          displayTeamName={mapDisplayTeamNameForCountryFlag}
        />
      </div>
    </section>
  );
};

GameCard.defaultProps = {
  children: null,
  displayTeamNames: 'auto',
  style: {},
};

GameCard.propTypes = {
  displayTeamNames: PropTypes.oneOf(['auto', 'small']),
  hometeam_name: PropTypes.string.isRequired,
  hometeam_abbreviation: PropTypes.string.isRequired,
  awayteam_name: PropTypes.string.isRequired,
  awayteam_abbreviation: PropTypes.string.isRequired,

  style: PropTypes.object,

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default GameCard;
