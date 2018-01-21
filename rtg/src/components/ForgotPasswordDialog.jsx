import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Dialog, FlatButton, TextField } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
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
  }

  componentWillReceiveProps(nextProps) {
    // reset my state on open
    if (nextProps.open === true) {
      this.setState(ForgotPasswordDialog.getInitialState);
    }
  }

  updateEmail(event, newValue) {
    this.setState({
      formError: null,
      formHasErrors: false,
      email: newValue,
    });
  }

  handleSubmit() {
    this.setState({ requestInProgress: true });
    AuthService.requestPasswordReset(this.state.email).then(() => {
      this.setState({
        ...ForgotPasswordDialog.getInitialState(),
        requestInProgress: false,
        passwordReminderSuccessful: true,
      }, () => {
        setTimeout(this.props.onClose, 5000);
      });
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

  render() {
    const actions = [];
    if (this.state.passwordReminderSuccessful) {
      actions.push(<FlatButton
        label="Schließen"
        primary
        onClick={this.props.onClose}
      />);
    } else {
      actions.push(<FlatButton label="Abbrechen" secondary onClick={this.props.onClose} />);
      actions.push(<FlatButton
        label="Abschicken"
        primary
        disabled={
          !this.state.email || this.state.email.length === 0 || this.state.requestInProgress
        }
        onClick={this.handleSubmit}
      />);
    }

    const titleDiv = (
      <div style={{ fontSize: '16px', textAlign: 'center' }}>
        <h2>Passwort vergessen</h2>
        <p style={{ marginBottom: '0' }}>Bitte gib Deine E-Mail Adresse ein, um Dein Passwort zurückzusetzen.</p>

        {this.state.formHasErrors &&
        <p style={{ color: this.props.muiTheme.palette.errorColor, marginBottom: '0' }}>{this.state.formError}</p>}
      </div>);

    return (
      <Dialog
        className="ForgotPasswordDialog"
        actions={actions}
        autoScrollBodyContent
        modal
        open={this.props.open}
        title={titleDiv}
        style={{ textAlign: 'left' }}
      >

        {!this.state.passwordReminderSuccessful && !this.state.requestInProgress &&
        <TextField
          errorText={this.state.fieldErrors.email || false}
          floatingLabelText="E-Mail eingeben"
          fullWidth
          value={this.state.email}
          onChange={this.updateEmail}
        />}

        {this.state.requestInProgress && <CircularProgress />}
        {this.state.passwordReminderSuccessful &&
        <p style={{ color: this.props.muiTheme.palette.successColor, textAlign: 'center' }}>
          Herzlichen Dank, bitte überprüfe nun Deine E-Mails, um Dein Passwort zurückzusetzen.
        </p>}
      </Dialog>
    );
  }
}

ForgotPasswordDialog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default muiThemeable()(ForgotPasswordDialog);
