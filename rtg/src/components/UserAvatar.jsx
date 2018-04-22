import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';
import { randomHueHexColor } from '../service/ColorHelper';
import { API_BASE_URL } from '../service/AuthService';

/**
 * An avatar showing the user image if given or the first letter of
 * the username with a random colour otherwise.
 */
class UserAvatar extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.username !== nextProps.username ||
      this.props.size !== nextProps.size ||
      this.props.img !== nextProps.img ||
      // poor man's "deep" comparison - does only work with JSON serializable values!
      JSON.stringify(this.props.style) !== JSON.stringify(nextProps.style);
  }

  render() {
    return (this.props.img ?
      <Avatar
        size={this.props.size}
        src={`${API_BASE_URL}/media/${this.props.img}`}
        style={this.props.style}
      /> :
      <Avatar
        color="#ffffff"
        backgroundColor={randomHueHexColor(45, 80)}
        size={this.props.size}
        style={this.props.style}
      >{this.props.username[0].toUpperCase()}
      </Avatar>);
  }
}

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
