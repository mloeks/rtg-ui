import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import CloseIcon from '@material-ui/icons/Close';

import AuthService from '../service/AuthService';
import VisiblePasswordField from './VisiblePasswordField';
import Notification, { NotificationType } from './Notification';

class RegisterDialog extends Component {
  static getInitialState() {
    return {
      registerSuccessful: false,

      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',

      fieldErrors: {
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        email: null,
      },
      formError: null,
      formHasErrors: false,

      hasChanges: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = RegisterDialog.getInitialState();

    this.handleKeyUpEvent = this.handleKeyUpEvent.bind(this);
    this.updateFormField = this.updateFormField.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reset my state on open
    if (nextProps.open === true) {
      window.addEventListener('keyup', this.handleKeyUpEvent, false);
      this.setState(RegisterDialog.getInitialState);
    } else {
      window.removeEventListener('keyup', this.handleKeyUpEvent);
    }
  }

  handleKeyUpEvent(e) {
    const { hasChanges } = this.state;
    if (e.keyCode === 13 && hasChanges) {
      this.handleSubmit(e);
    }
  }

  updateFormField(fieldName, newValue) {
    const newState = { formError: null, formHasErrors: false, hasChanges: true };
    newState[fieldName] = newValue;
    this.setState(newState);
  }

  updateUsername(e) { this.updateFormField('username', e.target.value); }

  updatePassword(e) { this.updateFormField('password', e.target.value); }

  updateFirstName(e) { this.updateFormField('firstName', e.target.value); }

  updateLastName(e) { this.updateFormField('lastName', e.target.value); }

  updateEmail(e) { this.updateFormField('email', e.target.value); }

  handleSubmit(e) {
    e.preventDefault();

    const {
      email,
      firstName,
      lastName,
      password,
      username,
    } = this.state;

    AuthService.register(username, email, password, firstName, lastName)
      .then(() => {
        this.setState({ registerSuccessful: true });
      })
      .catch((errors) => {
        this.setState({
          fieldErrors: errors.fieldErrors || {},
          formHasErrors: errors.nonFieldError,
          formError: errors.nonFieldError,
          hasChanges: false,
        });
      });
  }

  handleCancel(e) {
    const { onCancel } = this.props;
    this.setState(RegisterDialog.getInitialState, () => {
      onCancel(e);
    });
  }

  render() {
    const { fullScreen, open, theme } = this.props;
    const {
      password,
      fieldErrors,
      formError,
      formHasErrors,
      hasChanges,
      registerSuccessful,
    } = this.state;

    if (registerSuccessful) {
      return (<Redirect to="/foyer" />);
    }

    return (
      <Dialog
        className="RegisterDialog qa-register-dialog"
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="RegisterDialog__title"
        onClose={this.handleCancel}
      >
        <form
          className="RegisterDialog__form qa-register-form"
          onSubmit={this.handleSubmit}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <DialogTitle id="RegisterDialog__title">
            Werde Teil der RTG
            <IconButton
              aria-label="close"
              className="RegisterDialog__close"
              style={{ position: 'absolute', right: 10, top: 10 }}
              onClick={this.handleCancel}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {formHasErrors && (
              <Notification
                type={NotificationType.ERROR}
                title="Das hat leider nicht geklappt"
                subtitle={formError}
                containerStyle={{ marginBottom: 20 }}
              />
            )}

            <TextField
              name="username"
              autoFocus
              error={Boolean(fieldErrors.username)}
              helperText={fieldErrors.username || false}
              label="Username"
              fullWidth
              onChange={this.updateUsername}
            />
            <br />
            <br />
            <TextField
              name="email"
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email || false}
              label="E-Mail"
              fullWidth
              onChange={this.updateEmail}
            />
            <br />
            <br />
            <VisiblePasswordField
              name="password"
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password || ''}
              fullWidth
              value={password || ''}
              onChange={this.updatePassword}
            />
            <br />
            <div style={{ display: 'flex' }}>
              <TextField
                name="firstName"
                error={Boolean(fieldErrors.firstName)}
                helperText={fieldErrors.firstName || false}
                label="Vorname"
                style={{ marginRight: '10px', width: '50%' }}
                onChange={this.updateFirstName}
              />
              <TextField
                name="lastName"
                error={Boolean(fieldErrors.lastName)}
                helperText={fieldErrors.lastName || false}
                label="Nachname"
                style={{ marginLeft: '10px', width: '50%' }}
                onChange={this.updateLastName}
              />
            </div>
            <br />
            <p style={{ margin: 0, color: theme.palette.grey['600'], fontSize: 14 }}>
              Wir benötigen deinen echten Namen nur, um deine royale Identität zu prüfen.
              Dein Name ist nicht für andere Mitspieler sichtbar!
            </p>
          </DialogContent>

          <DialogActions>
            <Button color="secondary" onClick={this.handleCancel}>Abbrechen</Button>
            <Button
              className="RegisterDialog__submit qa-register-submit"
              color="primary"
              disabled={!hasChanges}
              type="submit"
            >
              Registrieren
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

RegisterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,

  fullScreen: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withMobileDialog()(withTheme(RegisterDialog));
