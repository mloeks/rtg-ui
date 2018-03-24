import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';
import { teal400 } from 'material-ui/styles/colors';
import Person from 'material-ui/svg-icons/social/person';
import AvatarImageCropper from 'react-avatar-image-cropper';

import './BigEditableAvatar.css';

// TODO P1 enable avatar upload, check https://www.npmjs.com/package/react-avatar-image-cropper
class BigEditableAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };
    this.avatarCropApply = this.avatarCropApply.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
  }

  avatarCropApply(file) {}

  handleAvatarClick(e) {
    console.log('click');
    this.setState({ editing: true }, () => {
      // document.querySelector('.BigEditableAvatar__cropper input').click();
    });
    e.preventDefault();
  }

  render() {
    const avatarCropper = (<AvatarImageCropper
      className="BigEditableAvatar__cropper"
      apply={this.avatarCropApply}
      iconStyle={{ display: 'none' }}
      textStyle={{ display: 'none' }}
      rootStyle={this.state.editing ? { width: '200px' } : { width: 0 }}
      maxsize={1024 * 1024 * 5}
    />);

    return (
      <div className="BigEditableAvatar">
        <Avatar
          className="BigEditableAvatar__avatar"
          backgroundColor={!this.props.avatarUrl ? teal400 : null}
          icon={!this.props.avatarUrl ? <Person style={{ pointerEvents: 'none' }} /> : null}
          src={this.props.avatarUrl}
          size={150}
          onClick={this.handleAvatarClick}
        >{avatarCropper}
        </Avatar>
        <h2 className="BigEditableAvatar__username">{this.props.username}</h2>
      </div>
    );
  }
}

BigEditableAvatar.defaultProps = {
  avatarUrl: null,
};

BigEditableAvatar.propTypes = {
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
};

export default BigEditableAvatar;
