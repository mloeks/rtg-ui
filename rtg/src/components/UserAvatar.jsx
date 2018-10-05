import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { randomHueHexColor } from '../service/ColorHelper';
import { API_BASE_URL } from '../service/AuthService';

/**
 * An avatar showing the user image if given or the first letter of
 * the username with a random colour otherwise.
 */
class UserAvatar extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      img,
      size,
      style,
      username,
    } = this.props;

    return username !== nextProps.username || size !== nextProps.size || img !== nextProps.img
      // poor man's "deep" comparison - does only work with JSON serializable values!
      || JSON.stringify(style) !== JSON.stringify(nextProps.style);
  }

  render() {
    const {
      className,
      img,
      onClick,
      size,
      style,
      username,
    } = this.props;

    return (
      <Avatar
        className={className}
        src={img ? `${API_BASE_URL}/media/${img}` : null}
        style={{
          backgroundColor: randomHueHexColor(45, 80),
          width: size,
          height: size,
          ...style,
        }}
        onClick={onClick}
      >
        {!img && username[0].toUpperCase()}
      </Avatar>
    );
  }
}

UserAvatar.defaultProps = {
  className: null,
  img: null,
  style: {},
  onClick: () => {},
};

UserAvatar.propTypes = {
  className: PropTypes.string,
  img: PropTypes.string,
  size: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onClick: PropTypes.func,
};

export default UserAvatar;
