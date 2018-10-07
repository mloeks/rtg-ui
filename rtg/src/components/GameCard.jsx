/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import CountryFlag from './CountryFlag';

import './GameCard.css';

// TODO P3 make props camelcase and map backend objects fields beforehand
// TODO P3 move team name from CountryFlag in here and clean up name mode foo
const GameCard = ({
  awayteam_abbreviation, awayteam_name, children, displayTeamNames,
  hometeam_abbreviation, hometeam_name, style,
}) => {
  const mapDisplayTeamNameForCountryFlag = displayTeamNames === 'auto' ? 'auto' : 'always';

  return (
    <section
      className={`GameCard ${displayTeamNames === 'auto' ? 'auto-hide' : ''}`}
      style={style}
    >
      <div className="GameCard__inner">
        <CountryFlag
          country={hometeam_name}
          countryCode={hometeam_abbreviation}
          displayTeamName={mapDisplayTeamNameForCountryFlag}
        />

        <div className="hometeam">
          {displayTeamNames !== 'small' ? hometeam_name : ''}
        </div>

        {children}

        <div className="awayteam">
          {displayTeamNames !== 'small' ? awayteam_name : ''}
        </div>

        <CountryFlag
          country={awayteam_name}
          countryCode={awayteam_abbreviation}
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

  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default GameCard;
