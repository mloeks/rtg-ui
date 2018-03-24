import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar, FlatButton, Slider } from 'material-ui';
import { teal400 } from 'material-ui/styles/colors';
import Person from 'material-ui/svg-icons/social/person';
import AvatarEditor from 'react-avatar-editor';
import Notification, { NotificationType } from '../Notification';

import './BigEditableAvatar.css';

// TODO P1 touchMove on Avatar edit does not seem to work yet
// TODO P2 investigate about console error on editing save and cancel
// TODO P3 offer rotate buttons
class BigEditableAvatar extends Component {
  static getInitialState() {
    return {
      chosenFile: null,
      editing: false,
      cropError: '',

      avatarEditScale: 1.2,

      uploadInProgress: false,
      uploadError: false,
      uploadSuccess: false,
    };
  }
  constructor(props) {
    super(props);

    this.state = BigEditableAvatar.getInitialState();

    this.editor = null;
    this.maxImageSize = 1024 * 1024 * 5;
    this.avatarSize = 180;
    this.avatarBorderSize = 6;

    this.setEditorRef = this.setEditorRef.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
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

  setEditorRef(editor) {
    this.editor = editor;
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

  handleEditSave() {
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();
      canvasScaled.toBlob((blob) => {
        // TODO P1 handle upload
        console.log(blob);
        this.setState(BigEditableAvatar.getInitialState());
      }, 'image/jpeg', 0.95);
    }
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
              ref={this.setEditorRef}
              image={this.state.chosenFile}
              width={this.avatarSize}
              height={this.avatarSize}
              border={0}
              borderRadius={this.avatarSize / 2}
              scale={this.state.avatarEditScale}
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
                style={{ display: 'none' }}
                onChange={this.handleFileInputChange}
              />
              <label htmlFor="fileElem">
                <Avatar
                  className="BigEditableAvatar__avatar-elem"
                  backgroundColor={!this.props.avatarUrl ? teal400 : null}
                  icon={!this.props.avatarUrl ? <Person style={{ pointerEvents: 'none' }} /> : null}
                  src={this.props.avatarUrl}
                  size={this.avatarSize}
                />
              </label>
            </div>}
        </div>

        {this.state.editing &&
          <div className="BigEditableAvatar__edit-actions">
            <Slider
              min={1}
              max={2}
              defaultValue={this.state.avatarEditScale}
              style={{ maxWidth: avatarPlusBorderSize, margin: '24px auto' }}
              sliderStyle={{ margin: 0 }}
              onChange={(e, val) => { this.setState({ avatarEditScale: val }); }}
            />

            <FlatButton label="Speichern" primary onClick={this.handleEditSave} />
            <FlatButton
              label="Abbrechen"
              onClick={() => { this.setState(BigEditableAvatar.getInitialState()); }}
            />
          </div>}

        <div className="BigEditableAvatar__feedback">
          {(this.state.cropError || this.state.uploadError) && <Notification
            type={NotificationType.ERROR}
            title="Das hat leider nicht geklappt"
            subtitle={this.getCropErrorReadableText()}
          />}
          {this.state.uploadSuccess && <Notification
            type={NotificationType.SUCCESS}
            title="Avatar erfolgreich geändert"
            disappearAfterMs={3000}
          />}
        </div>

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
