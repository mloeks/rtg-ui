import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { error } from '../../theme/RtgTheme';

const OpenBetsIndicator = props => (
  props.number > 0 ?
    <Link to="/bets" style={{ textDecoration: 'none' }} title="Tipps abgeben">
      <Avatar
        color="#FFF"
        backgroundColor={error}
        size={24}
        style={{ fontWeight: '500' }}
      >{props.number}
      </Avatar>
    </Link>
    : null
);

OpenBetsIndicator.propTypes = {
  number: PropTypes.number.isRequired,
};

export default OpenBetsIndicator;
