import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withMobileDialog from '@mui/material/withMobileDialog';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import CloseIcon from '@mui/icons/Close';

import Notification, { NotificationType } from './Notification';
import AuthService from '../service/AuthService';

class ForgotPasswordDialog extends Component {
  static getInitialState() {
    return {
      email: '',

      requestInProgress: false,
      passwordReminderSuccessful: false,

      fieldErrors: {
        email: null,
      },
      formError: null,
      formHasErrors: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = ForgotPasswordDialog.getInitialState();

    this.updateEmail = this.updateEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { onClose } = this.props;
    const { email } = this.state;

    this.setState({ requestInProgress: true });
    AuthService.requestPasswordReset(email).then(() => {
      this.setState({
        ...ForgotPasswordDialog.getInitialState(),
        requestInProgress: false,
        passwordReminderSuccessful: true,
      }, () => { setTimeout(onClose, 5000); });
    })
      .catch((loginErr) => {
        this.setState({
          requestInProgress: false,
          fieldErrors: loginErr.fieldErrors,
          formHasErrors: loginErr.message,
          formError: loginErr.message,
        });
      });
  }

  handleCancel(e) {
    const { onClose } = this.props;
    this.setState(ForgotPasswordDialog.getInitialState, () => {
      onClose(e);
    });
  }

  updateEmail(event) {
    this.setState({
      formError: null,
      formHasErrors: false,
      fieldErrors: {},
      email: event.target.value,
    });
  }

  render() {
    const { fullScreen } = this.props;

    const {
      email,
      fieldErrors,
      formError,
      formHasErrors,
      passwordReminderSuccessful,
      requestInProgress,
    } = this.state;

    return (
      <Dialog
        className="ForgotPasswordDialog"
        fullScreen={fullScreen}
        open
        aria-labelledby="ForgotPasswordDialog__title"
        onClose={this.handleCancel}
      >
        <form
          className="ForgotPasswordDialog__form"
          onSubmit={this.handleSubmit}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <DialogTitle id="ForgotPasswordDialog__title">
            Passwort vergessen
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
            Bitte gib Deine E-Mail Adresse ein, um Dein Passwort zurückzusetzen.

            {formHasErrors && (
              <Notification
                type={NotificationType.ERROR}
                title="Das hat leider nicht geklappt"
                subtitle={formError}
                containerStyle={{ marginTop: 20, marginBottom: 20 }}
              />
            )}

            {!passwordReminderSuccessful && !requestInProgress && (
              <TextField
                autoFocus
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email ? fieldErrors.email[0] : ''}
                label="E-Mail Adresse"
                type="email"
                fullWidth
                value={email}
                onChange={this.updateEmail}
                style={{ marginTop: 8 }}
              />
            )}
            {requestInProgress && <CircularProgress />}
            {passwordReminderSuccessful && (
              <Notification
                type={NotificationType.SUCCESS}
                title="Herzlichen Dank!"
                subtitle="Du solltest in Kürze eine E-Mail mit einem Link bekommen, um dein Passwort zurückzusetzen."
                containerStyle={{ marginTop: 20 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            {passwordReminderSuccessful && <Button color="primary" onClick={this.handleCancel}>Schließen</Button>}
            {!passwordReminderSuccessful && (
              <>
                <Button color="secondary" onClick={this.handleCancel}>Abbrechen</Button>
                <Button
                  color="primary"
                  disabled={!email || email.length === 0 || requestInProgress}
                  type="submit"
                >
                  Abschicken
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

ForgotPasswordDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(ForgotPasswordDialog);
