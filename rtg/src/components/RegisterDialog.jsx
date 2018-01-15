import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, TextField } from 'material-ui';

class RegisterDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      passwordRepeat: null,
      firstName: null,
      lastName: null,
      email: null,

      fieldErrors: {
        username: null,
        password: null,
        passwordRepeat: null,
        firstName: null,
        lastName: null,
        email: null,
      },
      formError: null,
      formHasErrors: false,

      hasChanges: false,
    };

    this.updateFormField = this.updateFormField.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePasswordRepeat = this.updatePasswordRepeat.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateFormField(fieldName, newValue) {
    const newState = { formError: null, formHasErrors: false, hasChanges: true };
    newState[fieldName] = newValue;
    this.setState(newState);
  }

  updateUsername(event, newValue) { this.updateFormField('username', newValue); }
  updatePassword(event, newValue) { this.updateFormField('password', newValue); }
  updatePasswordRepeat(event, newValue) { this.updateFormField('passwordRepeat', newValue); }
  updateFirstName(event, newValue) { this.updateFormField('firstName', newValue); }
  updateLastName(event, newValue) { this.updateFormField('lastName', newValue); }
  updateEmail(event, newValue) { this.updateFormField('email', newValue); }

  handleSubmit() {
    this.props.onSubmit(this.state.username, this.state.password);
  }

  // validate() {}

  render() {
    const actions = [
      <FlatButton label="Abbrechen" secondary onClick={this.props.onCancel} />,
      <FlatButton
        label="Registrieren"
        primary
        disabled={!this.state.hasChanges}
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        className="RegisterDialog"
        actions={actions}
        autoScrollBodyContent
        modal
        open={this.props.open}
        title="Werde Teil der Royalen Tippgemeinschaft"
      >
        <TextField
          errorText={this.state.fieldErrors.username || false}
          floatingLabelText="Username"
          fullWidth
          onChange={this.updateUsername}
        />
        <br />
        <TextField
          errorText={this.state.fieldErrors.email || false}
          floatingLabelText="E-Mail"
          fullWidth
          onChange={this.updateEmail}
        />
        <br />
        <TextField
          errorText={this.state.fieldErrors.password || false}
          floatingLabelText="Passwort"
          fullWidth
          type="password"
          onChange={this.updatePassword}
        />
        <br />
        <TextField
          errorText={this.state.fieldErrors.passwordRepeat || false}
          floatingLabelText="Passwort wiederholen"
          fullWidth
          type="password"
          onChange={this.updatePasswordRepeat}
        />
        <br />
        <div style={{ display: 'flex' }}>
          <TextField
            style={{ marginRight: '10px' }}
            errorText={this.state.fieldErrors.firstName || false}
            floatingLabelText="Vorname"
            onChange={this.updateFirstName}
          />
          <TextField
            style={{ marginLeft: '10px' }}
            errorText={this.state.fieldErrors.lastName || false}
            floatingLabelText="Nachname"
            onChange={this.updateLastName}
          />
        </div>
      </Dialog>
    );
  }
}

RegisterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterDialog;
