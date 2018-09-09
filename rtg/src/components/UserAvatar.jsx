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
    return this.props.username !== nextProps.username ||
      this.props.size !== nextProps.size ||
      this.props.img !== nextProps.img ||
      // poor man's "deep" comparison - does only work with JSON serializable values!
      JSON.stringify(this.props.style) !== JSON.stringify(nextProps.style);
  }

  render() {
    return (this.props.img ?
      <Avatar
        className={this.props.className}
        size={this.props.size}
        src={`${API_BASE_URL}/media/${this.props.img}`}
        style={this.props.style}
        onClick={this.props.onClick}
      /> :
      <Avatar
        className={this.props.className}
        color="#ffffff"
        backgroundColor={randomHueHexColor(45, 80)}
        size={this.props.size}
        style={this.props.style}
        onClick={this.props.onClick}
      >{this.props.username[0].toUpperCase()}
      </Avatar>);
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
