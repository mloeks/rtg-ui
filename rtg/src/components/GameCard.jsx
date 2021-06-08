import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import CountryFlag from './CountryFlag';

import './GameCard.scss';

/* eslint-disable camelcase */
// TODO P3 move team name from CountryFlag in here and clean up name mode foo
const GameCard = ({
  awayteam, awayteamAbbrev, children, displayTeamNames,
  hometeam, hometeamAbbrev, style,
}) => {
  const mapDisplayTeamNameForCountryFlag = displayTeamNames === 'auto' ? 'auto' : 'always';

  return (
    <section
      className={`GameCard ${displayTeamNames === 'auto' ? 'auto-hide' : ''}`}
      style={style}
    >
      <div className="GameCard__inner">
        <CountryFlag
          country={hometeam}
          countryCode={hometeamAbbrev}
          displayTeamName={mapDisplayTeamNameForCountryFlag}
        />

        <div className="hometeam">
          {displayTeamNames !== 'small' ? hometeam : ''}
        </div>

        {children}

        <div className="awayteam">
          {displayTeamNames !== 'small' ? awayteam : ''}
        </div>

        <CountryFlag
          country={awayteam}
          countryCode={awayteamAbbrev}
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
  hometeam: PropTypes.string.isRequired,
  hometeamAbbrev: PropTypes.string.isRequired,
  awayteam: PropTypes.string.isRequired,
  awayteamAbbrev: PropTypes.string.isRequired,

  style: stylePropType,

  // TODO P2 children aren't optional but a required definition of what kind of
  // "central element" the game card (wrapper!) should show.
  // Or can GameCardGameInfo be shown by default?
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default GameCard;
