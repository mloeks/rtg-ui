import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';

/**
 * An avatar showing the user image if given or the first letter of
 * the username with a random colour otherwise.
 */
const UserAvatar = ({ img, size, username, ...rest }) => (
  img ?
    <Avatar size={size} src={img} {...rest} /> :
    <Avatar size={size} {...rest}>{username[0].toUpperCase()}</Avatar>
);

UserAvatar.defaultProps = {
  img: null,
};

UserAvatar.propTypes = {
  img: PropTypes.string,
  size: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
};

export default UserAvatar;
