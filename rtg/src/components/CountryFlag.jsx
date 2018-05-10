import React from 'react';
import PropTypes from 'prop-types';

import './CountryFlag.css';
import countryFlags from '../theme/CountryFlagImporter';

// TODO P2 edit ugly scandinavian flags
// TODO P2 long names are still cut, e.g. Deutschland
const CountryFlag = ({ country, countryCode }) => (
  <div className="CountryFlag">
    <img
      src={countryFlags[countryCode.toUpperCase()]}
      alt={countryCode.toUpperCase()}
      className="CountryFlag__flag"
    />
    <div className="CountryFlag__name">{country}</div>
  </div>
);

CountryFlag.propTypes = {
  country: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
};

export default CountryFlag;
