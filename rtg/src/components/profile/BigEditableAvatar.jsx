import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar, CircularProgress, FlatButton, Slider } from 'material-ui';
import { teal400 } from 'material-ui/styles/colors';
import Person from 'material-ui/svg-icons/social/person';
import AvatarEditor from 'react-avatar-editor';
import Notification, { NotificationType } from '../Notification';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';

import './BigEditableAvatar.css';
import { white } from "../../theme/RtgTheme";

const EditingActions = props => (
  <div className="BigEditableAvatar__edit-actions" style={props.style}>
    <Slider
      min={1}
      max={3}
      defaultValue={props.initialSliderValue}
      sliderStyle={{ margin: '10px' }}
      onChange={props.onChange}
    />

    <FlatButton label="Speichern" primary onClick={props.onSave} />
    <FlatButton label="Abbrechen" onClick={props.onCancel} />
  </div>
);

EditingActions.defaultProps = {
  initialSliderValue: 1.0,
  style: {},
};

EditingActions.propTypes = {
  initialSliderValue: PropTypes.number,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// TODO P1 IE: form submit does not work. toBlob or object on which it is called
// does not seem to be defined
// TODO P1 vertical touchMove on Avatar edit does not work properly, conflicts with page scroll
// is it related to the console error about preventDefault which appears after it
// has worked properly for a short time? disable certain touch events?
// TODO P2 investigate about console error on editing save and cancel
// TODO P3 offer rotate buttons
// TODO P3 display progress indicator while image is loading client-side (if callbacks are offered)
class BigEditableAvatar extends Component {
  static getInitialState() {
    return {
      chosenFile: null,
      editing: false,
      cropError: '',

      avatarEditScale: 1.2,

      uploadInProgress: false,
      uploadError: '',
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

  getCropOrUploadErrorReadableText() {
    if (this.state.uploadError) {
      return this.state.uploadError;
    }

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

    this.setState({ editing: false, cropError: '', uploadError: '' });

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
      this.setState(
        { uploadInProgress: true, uploadSuccess: false, uploadError: '' },
        () => {
          const canvasScaled = this.editor.getImageScaledToCanvas();

          canvasScaled.toBlob((blob) => {
            const formData = new FormData();
            formData.set('upload', blob, 'avatar.jpg');

            fetch(`${API_BASE_URL}/rtg/users/${this.props.userId}/avatar/`, {
              method: 'POST',
              body: formData,
              headers: { Authorization: `Token ${AuthService.getToken()}` },
            }).then(FetchHelper.parseJson)
              .then((response) => {
                if (response.ok) {
                  this.setState({
                    ...BigEditableAvatar.getInitialState(),
                    uploadSuccess: true,
                  }, () => {
                    this.props.onAvatarChanged(response.json.avatar);
                  });
                } else {
                  this.setState({
                    ...BigEditableAvatar.getInitialState(),
                    uploadError: response.json.error || 'Bitte versuche es später noch einmal.',
                  });
                }
              }).catch(() => this.setState({
                ...BigEditableAvatar.getInitialState(),
                uploadError: 'Bitte versuche es später noch einmal.',
              }));
          }, 'image/jpeg', 0.95);
        },
      );
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

    const noAvatarPlaceholder = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'auto',
          height: 'auto',
        }}
      >
        <Person
          color="white"
          style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
        />
        <span style={{ fontSize: '14px', opacity: 0.8 }}>Klicken zum Ändern</span>
      </div>
    );

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
                  icon={!this.props.avatarUrl ? noAvatarPlaceholder : null}
                  src={this.props.avatarUrl}
                  size={this.avatarSize}
                />
              </label>
            </div>}
        </div>

        {(this.state.editing && !this.state.uploadInProgress) &&
          <EditingActions
            initialSliderValue={this.state.avatarEditScale}
            onChange={(e, val) => { this.setState({ avatarEditScale: val }); }}
            onSave={this.handleEditSave}
            onCancel={() => { this.setState(BigEditableAvatar.getInitialState()); }}
            style={{ maxWidth: avatarPlusBorderSize, margin: '0 auto' }}
          />}

        <div className="BigEditableAvatar__feedback">
          {this.state.uploadInProgress &&
            <CircularProgress size={30} thickness={2.5} style={{ margin: '20px 0' }} />}
          {(this.state.cropError || this.state.uploadError) && <Notification
            type={NotificationType.ERROR}
            title="Das hat leider nicht geklappt"
            subtitle={this.getCropOrUploadErrorReadableText()}
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

  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.bool.isRequired,

  onAvatarChanged: PropTypes.func.isRequired,
};

export default BigEditableAvatar;
