import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

const OpenBetsIndicator = ({ number, theme }) => (
  number > 0
    ? (
      <Link to="/bets" style={{ textDecoration: 'none' }} title="Tipps abgeben">
        <Avatar
          style={{
            width: 24,
            height: 24,
            color: theme.palette.common.white,
            backgroundColor: theme.palette.error.main,
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          {number}
        </Avatar>
      </Link>
    ) : null
);

OpenBetsIndicator.propTypes = {
  number: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(OpenBetsIndicator);
