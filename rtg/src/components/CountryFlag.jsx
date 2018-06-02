import React from 'react';
import PropTypes from 'prop-types';

import './CountryFlag.css';
import countryFlags from '../theme/CountryFlagImporter';

// TODO P3 add context menu with links to team portraits
const CountryFlag = ({ country, countryCode, displayTeamName }) => {
  // hack for the only team name which is as long that it breaks in two lines
  // which we don't want here in order to keep the height of the GameCards low
  const sanitizedCountry = country === 'Saudi-Arabien' ? 'S.-Arabien' : country;
  return (
    <div className="CountryFlag">
      <img
        src={countryFlags[countryCode.toUpperCase()]}
        alt={countryCode.toUpperCase()}
        className="CountryFlag__flag"
      />
      <div className={`CountryFlag__name ${displayTeamName === 'auto' ? 'auto-hide' : ''}`}>
        {sanitizedCountry}
        </div>
    </div>
  );
};

CountryFlag.defaultProps = {
  displayTeamName: 'auto',
};

CountryFlag.propTypes = {
  country: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  displayTeamName: PropTypes.oneOf(['auto', 'always']),
};

export default CountryFlag;
