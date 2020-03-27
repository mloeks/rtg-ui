import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CloseIcon from '@material-ui/icons/Close';

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

  updateEmail(event) {
    this.setState({
      formError: null,
      formHasErrors: false,
      fieldErrors: {},
      email: event.target.value,
    });
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
      .catch((errors) => {
        this.setState({
          requestInProgress: false,
          fieldErrors: errors.fieldErrors || {},
          formHasErrors: errors.nonFieldError,
          formError: errors.nonFieldError,
        });
      });
  }

  handleCancel(e) {
    const { onClose } = this.props;
    this.setState(ForgotPasswordDialog.getInitialState, () => {
      onClose(e);
    });
  }

  render() {
    const { fullScreen, theme } = this.props;

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
            <DialogContentText>
              Bitte gib Deine E-Mail Adresse ein, um Dein Passwort zurückzusetzen.
              {formHasErrors && (
                <span style={{ color: theme.palette.error.main, marginBottom: '0' }}>{formError}</span>
              )}
            </DialogContentText>

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
              <p style={{ color: theme.palette.successColor, textAlign: 'center' }}>
                Herzlichen Dank! Du solltest in Kürze eine E-Mail mit einem Link bekommen, um dein
                Passwort zurückzusetzen.
              </p>
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
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(withTheme(ForgotPasswordDialog));
