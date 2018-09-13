import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import withTheme from '@material-ui/core/styles';
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

    this.handleKeyUpEvent = this.handleKeyUpEvent.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // reset my state on open
    if (nextProps.open === true) {
      window.addEventListener('keyup', this.handleKeyUpEvent, false);
      this.setState(ForgotPasswordDialog.getInitialState);
    } else {
      window.removeEventListener('keyup', this.handleKeyUpEvent);
    }
  }

  handleKeyUpEvent(e) {
    if (e.keyCode === 13) {
      if (this.state.email) {
        this.handleSubmit();
      }
    }
  }

  updateEmail(event, newValue) {
    this.setState({
      formError: null,
      formHasErrors: false,
      fieldErrors: {},
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
      actions.push(<Button color="primary" onClick={this.props.onClose}>
        Schließen
      </Button>);
    } else {
      actions.push(<Button color="secondary" onClick={this.props.onClose}>Abbrechen</Button>);
      actions.push(<Button
        color="primary"
        disabled={
          !this.state.email || this.state.email.length === 0 || this.state.requestInProgress
        }
        onClick={this.handleSubmit}
      >
        Abschicken
      </Button>);
    }

    const titleDiv = (
      <div style={{ fontSize: '16px', textAlign: 'center', marginBottom: 0, paddingBottom: 0 }}>
        <h3 style={{ margin: 0 }}>Passwort vergessen</h3>
        <p style={{ marginBottom: '0', lineHeight: 1.4 }}>Bitte gib Deine E-Mail Adresse ein, um Dein Passwort zurückzusetzen.</p>

        {this.state.formHasErrors &&
        <p style={{ color: this.props.theme.palette.error.main, marginBottom: '0' }}>{this.state.formError}</p>}
      </div>);

    return (
      <Dialog
        className="ForgotPasswordDialog"
        actions={actions}
        autoScrollBodyContent
        modal
        open={this.props.open}
        repositionOnUpdate={false}
        title={titleDiv}
        style={{ textAlign: 'left', paddingTop: 0 }}
        contentClassName="ForgotPasswordDialog__content"
        contentStyle={{ padding: '10px', width: '100%', transform: 'translate(0, 0)' }}
      >
        {!this.state.passwordReminderSuccessful && !this.state.requestInProgress &&
          <TextField
            errorText={this.state.fieldErrors.email || false}
            floatingLabelText="E-Mail Adresse"
            fullWidth
            value={this.state.email}
            onChange={this.updateEmail}
          />}

        {this.state.requestInProgress && <CircularProgress />}
        {this.state.passwordReminderSuccessful &&
        <p style={{ color: this.props.theme.palette.successColor, textAlign: 'center' }}>
          Herzlichen Dank! Du solltest in Kürze eine E-Mail mit einem Link bekommen, um dein
          Passwort zurückzusetzen.
        </p>}
      </Dialog>
    );
  }
}

ForgotPasswordDialog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withTheme()(ForgotPasswordDialog);
