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

const MIN_AVATAR_ZOOM = 1;
const MAX_AVATAR_ZOOM = 3;
const AVATAR_ZOOM_INCREMENT = 0.2;

const EditingActions = props => (
  <form
    className="BigEditableAvatar__edit-actions"
    style={props.style}
    onSubmit={(e) => { e.preventDefault(); props.onSave(); }}
    noValidate
  >
    <div className="BigEditableAvatar__slider-wrapper">
      <FlatButton
        primary
        style={{ minWidth: '10px' }}
        onClick={props.onZoomOut}
      >–
      </FlatButton>

      <Slider
        className="BigEditableAvatar__slider"
        min={props.minSliderValue}
        max={props.maxSliderValue}
        value={props.sliderValue}
        sliderStyle={{ margin: '0 10px', width: 'auto' }}
        onChange={props.onZoomChange}
      />

      <FlatButton
        primary
        style={{ minWidth: '10px' }}
        onClick={props.onZoomIn}
      >+
      </FlatButton>
    </div>

    <FlatButton type="submit" label="Speichern" primary />
    <FlatButton label="Abbrechen" onClick={props.onCancel} />
  </form>
);

EditingActions.defaultProps = {
  minSliderValue: MIN_AVATAR_ZOOM,
  maxSliderValue: MAX_AVATAR_ZOOM,
  sliderValue: 1.0,
  style: {},
};

EditingActions.propTypes = {
  maxSliderValue: PropTypes.number,
  minSliderValue: PropTypes.number,
  sliderValue: PropTypes.number,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// TODO P2 vertical touchMove on Avatar edit does not work properly, conflicts with page scroll
// this only seems to be an issue with Chrome, preventing passive events from using
// prevent default, cf. https://www.chromestatus.com/features/5093566007214080
// works on firefox. How to disable it in Chrome? Open issue in github?

// TODO P2 investigate about console error on editing save and cancel
// TODO P3 offer rotate button(s)
// TODO P3 display progress indicator while image is loading client-side (if callbacks are offered)
class BigEditableAvatar extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.avatarUrl && nextProps.avatarUrl) {
      return { avatarUrl: nextProps.avatarUrl };
    }
    return null;
  }

  static getInitialState(props) {
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

    this.state = {
      avatarUrl: null,
      ...BigEditableAvatar.getInitialState(props),
    };

    this.editor = null;
    this.maxImageSize = 1024 * 1024 * 5;
    this.avatarSize = 180;
    this.avatarBorderSize = 6;

    this.setEditorRef = this.setEditorRef.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleAvatarZoom = this.handleAvatarZoom.bind(this);
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

  handleAvatarZoom(scale) {
    this.setState((prevState) => {
      let newVal = prevState.avatarEditScale + (scale * AVATAR_ZOOM_INCREMENT);
      if (newVal <= MIN_AVATAR_ZOOM) { newVal = MIN_AVATAR_ZOOM; }
      if (newVal >= MAX_AVATAR_ZOOM) { newVal = MAX_AVATAR_ZOOM; }
      return { avatarEditScale: newVal };
    });
  }

  handleEditSave() {
    if (this.editor) {
      this.setState(
        { uploadInProgress: true, uploadSuccess: false, uploadError: '' },
        () => {
          const canvasScaled = this.editor.getImageScaledToCanvas();

          canvasScaled.toBlob((blob) => {
            const formData = new FormData();
            formData.append('upload', blob, 'avatar.jpg');

            fetch(`${API_BASE_URL}/rtg/users/${this.props.userId}/avatar/`, {
              method: 'POST',
              body: formData,
              headers: { Authorization: `Token ${AuthService.getToken()}` },
            }).then(FetchHelper.parseJson)
              .then((response) => {
                if (response.ok) {
                  this.setState({
                    ...BigEditableAvatar.getInitialState(),
                    avatarUrl: response.json.avatar,
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
      <div className="BigEditableAvatar" style={{ marginTop: -(avatarPlusBorderSize / 2) - 10 }}>
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
                  backgroundColor={!this.state.avatarUrl ? teal400 : null}
                  icon={!this.state.avatarUrl ? noAvatarPlaceholder : null}
                  src={`${API_BASE_URL}/media/${this.state.avatarUrl}`}
                  size={this.avatarSize}
                />
              </label>
            </div>}
        </div>

        {(this.state.editing && !this.state.uploadInProgress) &&
          <EditingActions
            sliderValue={this.state.avatarEditScale}
            onZoomIn={() => this.handleAvatarZoom(1)}
            onZoomOut={() => this.handleAvatarZoom(-1)}
            onZoomChange={(e, val) => { this.setState({ avatarEditScale: val }); }}
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
