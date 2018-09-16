import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import AuthService from '../service/AuthService';
import VisiblePasswordField from './VisiblePasswordField';
import Notification, { NotificationType } from './Notification';
import { lightGrey } from '../theme/RtgTheme';

// TODO P3 fix error messages "darf nicht null sein"
class RegisterDialog extends Component {
  static getInitialState() {
    return {
      registerSuccessful: false,

      username: null,
      password: null,
      firstName: null,
      lastName: null,
      email: null,

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
  }

  componentWillReceiveProps(nextProps) {
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
    if (e.keyCode === 13) {
      if (hasChanges) {
        this.handleSubmit();
      }
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

  handleSubmit() {
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

  render() {
    const { fullScreen, onCancel, open } = this.props;
    const {
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
        className="RegisterDialog"
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="RegisterDialog__title"
        onClose={onCancel}
      >
        <DialogTitle id="RegisterDialog__title">Werde Teil der RTG</DialogTitle>
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
            error={Boolean(fieldErrors.username)}
            helperText={fieldErrors.username || false}
            label="Username"
            fullWidth
            onChange={this.updateUsername}
          />
          <br />
          <br />
          <TextField
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email || false}
            label="E-Mail"
            fullWidth
            onChange={this.updateEmail}
          />
          <br />
          <br />
          <VisiblePasswordField
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            fullWidth
            onChange={this.updatePassword}
          />
          <br />
          <div style={{ display: 'flex' }}>
            <TextField
              error={Boolean(fieldErrors.firstName)}
              helperText={fieldErrors.firstName || false}
              label="Vorname"
              style={{ marginRight: '10px', width: '50%' }}
              onChange={this.updateFirstName}
            />
            <TextField
              error={Boolean(fieldErrors.lastName)}
              helperText={fieldErrors.lastName || false}
              label="Nachname"
              style={{ marginLeft: '10px', width: '50%' }}
              onChange={this.updateLastName}
            />
          </div>
          <br />
          <p style={{ margin: 0, color: lightGrey }}>
            Wir benötigen deinen echten Namen nur, um deine royale Identität zu prüfen.
            Dein Name ist nicht für andere Mitspieler sichtbar.
          </p>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancel}>Abbrechen</Button>
          <Button color="primary" disabled={!hasChanges} onClick={this.handleSubmit}>
            Registrieren
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

RegisterDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default withMobileDialog()(RegisterDialog);
