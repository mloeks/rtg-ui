import React from 'react';
import PropTypes from 'prop-types';

import countryFlags from '../theme/CountryFlagImporter';

const CountryFlag = ({ countryCode, ...rest }) => (
  <img
    src={countryFlags[countryCode.toUpperCase()]}
    alt={countryCode.toUpperCase()}
    {...rest}
  />
);

CountryFlag.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default CountryFlag;
