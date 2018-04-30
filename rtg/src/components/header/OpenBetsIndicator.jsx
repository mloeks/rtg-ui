import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';
import { Link } from 'react-router-dom';
import { error } from '../../theme/RtgTheme';

const OpenBetsIndicator = props => (
  props.number > 0 ?
    <Link to="/bets" style={{ textDecoration: 'none' }}>
      <Avatar
        color="#FFF"
        backgroundColor={error}
        size={28}
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
