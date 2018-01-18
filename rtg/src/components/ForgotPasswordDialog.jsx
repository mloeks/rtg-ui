import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, TextField } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AuthService from "../service/AuthService";

class ForgotPasswordDialog extends Component {
  static getInitialState() {
    return {
      passwordReminderSuccessful: false,

      email: null,

      fieldErrors: {
        email: null,
      },
      formError: null,
      formHasErrors: false,

      hasChanges: false,
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
      hasChanges: true,
      email: newValue,
    });
  }

  handleSubmit() {
    AuthService.requestPasswordReset(this.state.email).then(() => {
      this.setState({ passwordReminderSuccessful: true });
    })
      .catch((errors) => {
        this.setState({
          fieldErrors: errors.fieldErrors || {},
          formHasErrors: errors.nonFieldError,
          formError: errors.nonFieldError,
        });
      });
  }

  render() {
    const actions = [
      <FlatButton label="Abbrechen" secondary onClick={this.props.onCancel} />,
      <FlatButton
        label="Abschicken"
        primary
        disabled={!this.state.hasChanges}
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        className="ForgotPasswordDialog"
        actions={actions}
        autoScrollBodyContent
        modal
        open={this.props.open}
        title={
          <div style={{ textAlign: 'center' }}>
            <h2>Passwort vergessen</h2>
            {this.state.formHasErrors &&
            <p style={{ color: this.props.muiTheme.palette.errorColor }}>{this.state.formError}</p>}
            <p>Bitte gib Deine E-Mail Adresse ein, um Dein Passwort zurückzusetzen.</p>
          </div>}
        style={{ textAlign: 'left' }}
      >

        <TextField
          errorText={this.state.fieldErrors.email || false}
          floatingLabelText="E-Mail"
          fullWidth
          onChange={this.updateEmail}
        />
      </Dialog>
    );
  }
}

ForgotPasswordDialog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default muiThemeable()(ForgotPasswordDialog);
