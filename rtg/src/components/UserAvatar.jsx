import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';
import { randomHueHexColor } from '../service/ColorHelper';

/**
 * An avatar showing the user image if given or the first letter of
 * the username with a random colour otherwise.
 */
const UserAvatar = ({
  img, size, username, style
}) => (
  img ?
    <Avatar size={size} src={img} style={style} /> :
    <Avatar
      color="#ffffff"
      backgroundColor={randomHueHexColor(45, 80)}
      size={size}
      style={style}
    >{username[0].toUpperCase()}
    </Avatar>
);

UserAvatar.defaultProps = {
  img: null,
  style: {},
};

UserAvatar.propTypes = {
  img: PropTypes.string,
  size: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default UserAvatar;
