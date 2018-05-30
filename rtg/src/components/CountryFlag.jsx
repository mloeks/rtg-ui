import React from 'react';
import PropTypes from 'prop-types';

import './CountryFlag.css';
import countryFlags from '../theme/CountryFlagImporter';

// TODO P2 edit ugly scandinavian flags
const CountryFlag = ({ country, countryCode, displayTeamName }) => (
  <div className="CountryFlag">
    <img
      src={countryFlags[countryCode.toUpperCase()]}
      alt={countryCode.toUpperCase()}
      className="CountryFlag__flag"
    />
    <div className={`CountryFlag__name ${displayTeamName === 'auto' ? 'auto-hide' : ''}`}>{country}</div>
  </div>
);

CountryFlag.defaultProps = {
  displayTeamName: 'auto',
};

CountryFlag.propTypes = {
  country: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  displayTeamName: PropTypes.oneOf(['auto', 'always']),
};

export default CountryFlag;
