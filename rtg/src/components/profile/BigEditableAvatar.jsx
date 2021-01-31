import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';

import PersonIcon from '@material-ui/icons/Person';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import teal from '@material-ui/core/colors/teal';

import AvatarEditor from 'react-avatar-editor';
import Notification, { NotificationType } from '../Notification';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';

import './BigEditableAvatar.scss';

const MIN_AVATAR_ZOOM = 1;
const MAX_AVATAR_ZOOM = 5;
const AVATAR_ZOOM_INCREMENT = 0.2;

const EditingActions = ({
  maxSliderValue, minSliderValue, onCancel, onRotateLeft, onRotateRight, onSave,
  onZoomChange, onZoomIn, onZoomOut, sliderValue, style,
}) => (
  <form
    className="BigEditableAvatar__edit-actions"
    style={style}
    onSubmit={(e) => { e.preventDefault(); onSave(); }}
    noValidate
  >
    <div className="BigEditableAvatar__rotation-wrapper">
      <IconButton onClick={onRotateRight}>
        <RotateRightIcon color="primary" />
      </IconButton>
      <IconButton onClick={onRotateLeft}>
        <RotateLeftIcon color="primary" />
      </IconButton>
    </div>
    <div className="BigEditableAvatar__slider-wrapper">
      <Button color="primary" style={{ minWidth: 15, padding: 0 }} onClick={onZoomOut}>
        –
      </Button>

      <Slider
        className="BigEditableAvatar__slider"
        min={minSliderValue}
        max={maxSliderValue}
        value={sliderValue}
        onChange={onZoomChange}
      />

      <Button color="primary" style={{ minWidth: 15, padding: 0 }} onClick={onZoomIn}>
        +
      </Button>
    </div>

    <Button color="secondary" onClick={onCancel}>Abbrechen</Button>
    <Button type="submit" color="primary">Speichern</Button>
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
  style: stylePropType,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onRotateLeft: PropTypes.func.isRequired,
  onRotateRight: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

class BigEditableAvatar extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.avatarUrl && nextProps.avatarUrl) {
      return { avatarUrl: nextProps.avatarUrl };
    }
    return null;
  }

  static getInitialState() {
    return {
      chosenFile: null,
      editing: false,
      cropError: '',

      avatarEditScale: 1.2,
      avatarRotation: 0,

      uploadInProgress: false,
      uploadError: '',
      uploadSuccess: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      avatarUrl: null,
      ...BigEditableAvatar.getInitialState(),
    };

    this.editor = null;
    this.maxImageSize = 1024 * 1024 * 5;
    this.avatarSize = 180;
    this.avatarBorderSize = 6;

    this.setEditorRef = this.setEditorRef.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleAvatarZoom = this.handleAvatarZoom.bind(this);
    this.handleAvatarRotate = this.handleAvatarRotate.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
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

  handleAvatarRotate(increment) {
    this.setState((prevState) => {
      const avatarRotation = prevState.avatarRotation + increment;
      return { avatarRotation };
    });
  }

  handleEditSave() {
    if (this.editor) {
      this.setState(
        { uploadInProgress: true, uploadSuccess: false, uploadError: '' },
        () => {
          const { userId } = this.props;
          const canvasScaled = this.editor.getImageScaledToCanvas();

          canvasScaled.toBlob((blob) => {
            const formData = new FormData();
            formData.append('upload', blob, 'avatar.jpg');

            fetch(`${API_BASE_URL}/rtg/users/${userId}/avatar/`, {
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
                    const { onAvatarChanged } = this.props;
                    onAvatarChanged(response.json.avatar);
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

  getCropOrUploadErrorReadableText() {
    const { cropError, uploadError } = this.state;
    if (uploadError) {
      return uploadError;
    }

    if (cropError === 'maxsize') {
      const maxSizeReadable = `${this.maxImageSize / 1024 / 1024} MB`;
      return `Das Bild überschreitet die maximale erlaubte Dateigröße von ${maxSizeReadable}`;
    }
    if (cropError === 'not_image') {
      return 'Erlaubte Dateitypen sind PNG/JPG/JPEG.';
    }
    return 'Bitte versuche es später noch einmal.';
  }

  setEditorRef(editor) {
    this.editor = editor;
  }

  render() {
    const {
      avatarEditScale,
      avatarRotation,
      avatarUrl,
      chosenFile,
      cropError,
      editing,
      uploadError,
      uploadInProgress,
      uploadSuccess,
    } = this.state;

    const { username } = this.props;

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
          margin: this.avatarSize / 4.5,
          width: 'auto',
          height: 'auto',
        }}
      >
        <PersonIcon
          style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
        />
        <span style={{ fontSize: '14px', opacity: 0.8 }}>Klicken zum Ändern</span>
      </div>
    );

    return (
      <div className="BigEditableAvatar" style={{ marginTop: -(avatarPlusBorderSize / 2) - 10 }}>
        <div className="BigEditableAvatar__avatar" style={avatarDivStyle}>
          {(editing && chosenFile)
            && (
              <AvatarEditor
                ref={this.setEditorRef}
                image={chosenFile}
                width={this.avatarSize}
                height={this.avatarSize}
                border={0}
                borderRadius={this.avatarSize / 2}
                scale={avatarEditScale}
                rotate={avatarRotation}
                style={{ borderRadius: this.avatarSize / 2 }}
              />
            )}

          {!editing
            && (
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
                    src={avatarUrl ? `${API_BASE_URL}/media/${avatarUrl}` : null}
                    style={{
                      width: this.avatarSize,
                      height: this.avatarSize,
                      backgroundColor: !avatarUrl ? teal['400'] : null,
                    }}
                  >
                    {!avatarUrl && noAvatarPlaceholder}
                  </Avatar>
                </label>
              </div>
            )}
        </div>

        {(editing && !uploadInProgress)
          && (
            <EditingActions
              sliderValue={avatarEditScale}
              onZoomIn={() => this.handleAvatarZoom(1)}
              onZoomOut={() => this.handleAvatarZoom(-1)}
              onZoomChange={(e, val) => { this.setState({ avatarEditScale: val }); }}
              onRotateLeft={() => this.handleAvatarRotate(-90)}
              onRotateRight={() => this.handleAvatarRotate(90)}
              onSave={this.handleEditSave}
              onCancel={() => { this.setState(BigEditableAvatar.getInitialState()); }}
              style={{ maxWidth: 250, margin: '0 auto' }}
            />
          )}

        <div className="BigEditableAvatar__feedback">
          {uploadInProgress
            && <CircularProgress size={30} thickness={2.5} style={{ margin: '20px 0' }} />}

          {(cropError || uploadError)
            && (
              <Notification
                type={NotificationType.ERROR}
                title="Das hat leider nicht geklappt"
                subtitle={this.getCropOrUploadErrorReadableText()}
              />
            )}

          {uploadSuccess
            && (
              <Notification
                type={NotificationType.SUCCESS}
                title="Avatar erfolgreich geändert"
                disappearAfterMs={3000}
              />
            )}
        </div>

        <h2 className="BigEditableAvatar__username qa-avatar-username" style={{ margin: '15px 0 0' }}>
          {username}
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

  // TODO P3 display progress indicator while image is loading client-side
  // (if callbacks are offered)
  // loading: PropTypes.bool.isRequired,
  // loadingError: PropTypes.bool.isRequired,

  onAvatarChanged: PropTypes.func.isRequired,
};

export default BigEditableAvatar;
