import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';
import { teal400 } from 'material-ui/styles/colors';
import Person from 'material-ui/svg-icons/social/person';
import AvatarEditor from 'react-avatar-editor';
import Notification, { NotificationType } from '../Notification';

import './BigEditableAvatar.css';

class BigEditableAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chosenFile: null,
      editing: false,
      cropError: '',
    };

    this.maxImageSize = 1024 * 100;
    this.avatarSize = 180;
    this.avatarBorderSize = 6;

    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    // this.handleAvatarClick = this.handleAvatarClick.bind(this);
    // this.handleCropApply = this.handleCropApply.bind(this);
    // this.handleCropCancel = this.handleCropCancel.bind(this);
  }

  getCropErrorReadableText() {
    if (this.state.cropError === 'maxsize') {
      const maxSizeReadable = `${this.maxImageSize / 1024 / 1024} MB`;
      return `Das Bild überschreitet die maximale erlaubte Dateigröße von ${maxSizeReadable}`;
    } else if (this.state.cropError === 'not_image') {
      return 'Erlaubte Dateitypen sind PNG/JPG/JPEG.';
    }
    return 'Bitte versuche es später noch einmal.';
  }

  handleFileInputChange(e) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({ editing: false, cropError: false });

    const chosenFile = e.target.files[0];
    if (chosenFile) {
      if (!(chosenFile.type === 'image/jpeg' || chosenFile.type === 'image/png')) {
        this.handleCropError('not_image');
        return;
      }
      if (chosenFile.size > this.maxImageSize) {
        this.handleCropError('maxsize');
        return;
      }

      this.setState({ editing: true, chosenFile });
    }
  }

  handleCropError(errorType) {
    this.setState({ editing: false, cropError: errorType });
  }

  render() {
    const avatarPlusBorderSize = this.avatarSize + (2 * this.avatarBorderSize);
    const avatarDivStyle = {
      backgroundColor: 'white',
      boxSizing: 'border-box',
      border: `${this.avatarBorderSize}px solid white`,
      borderRadius: avatarPlusBorderSize / 2,
      width: avatarPlusBorderSize,
      height: avatarPlusBorderSize,
      margin: 'auto',
    };

    return (
      <div className="BigEditableAvatar" style={{ marginTop: -avatarPlusBorderSize / 2 }}>
        <div className="BigEditableAvatar__avatar" style={avatarDivStyle}>
          {(this.state.editing && this.state.chosenFile) &&
            <AvatarEditor
              image={this.state.chosenFile}
              width={this.avatarSize}
              height={this.avatarSize}
              border={0}
              borderRadius={this.avatarSize / 2}
              scale={1.2}
              rotate={0}
              style={{ borderRadius: this.avatarSize / 2 }}
            />}

          {!this.state.editing &&
            <div>
              <input
                type="file"
                id="fileElem"
                multiple
                accept="image/*"
                style={{ display: 'none'}}
                onChange={this.handleFileInputChange}
              />
              <label htmlFor="fileElem">
                <Avatar
                  className="BigEditableAvatar__avatar-elem"
                  backgroundColor={!this.props.avatarUrl ? teal400 : null}
                  icon={!this.props.avatarUrl ? <Person style={{ pointerEvents: 'none' }} /> : null}
                  src={this.props.avatarUrl}
                  size={this.avatarSize}
                  onClick={this.handleAvatarClick}
                  style={{}}
                />
              </label>
            </div>}
        </div>

        {this.state.cropError && <Notification
          type={NotificationType.ERROR}
          title="Das hat leider nicht geklappt"
          subtitle={this.getCropErrorReadableText()}
        />}

        <h2 className="BigEditableAvatar__username" style={{ margin: '15px 0 0' }}>
          {this.props.username}
        </h2>
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
