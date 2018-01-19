import React, { Component } from 'react';
import { Paper, RaisedButton, TextField } from 'material-ui';
import Page from './Page';

class PasswordReset extends Component {
  static getInitialState() {
    return {
      password: '',
      passwordRepeat: '',

      fieldErrors: {
        password: null,
        passwordRepeat: null,
      },

      formHasErrors: false,
      formError: null,
    };
  }

  constructor(props) {
    super(props);

    this.state = PasswordReset.getInitialState();

    this.updatePassword = this.updatePassword.bind(this);
    this.updatePasswordRepeat = this.updatePasswordRepeat.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateFormField(fieldName, newValue) {
    const newState = { formError: null, formHasErrors: false, hasChanges: true };
    newState[fieldName] = newValue;
    this.setState(newState);
  }

  updatePassword(event, newValue) { this.updateFormField('password', newValue); }
  updatePasswordRepeat(event, newValue) { this.updateFormField('passwordRepeat', newValue); }

  handleSubmit(e) {
    // TODO make request to set new password and handle result
    this.setState(PasswordReset.getInitialState());
    e.preventDefault();
  }

  render() {
    return (
      <Page className="PasswordResetPage">
        <h1>Neues Passwort vergeben</h1>
        <Paper
          className="PasswordResetForm"
          zDepth={1}
          style={{ margin: '0 auto 100px', padding: '20px', width: '50%' }}
        >
          <p>Bitte gib Dein neues Passwort zweimal ein:</p>
          <form className="PasswordResetForm__form" onSubmit={this.handleSubmit}>
            <TextField
              errorText={this.state.fieldErrors.password || false}
              floatingLabelText="Passwort"
              fullWidth
              type="password"
              value={this.state.password}
              onChange={this.updatePassword}
            />
            <br />
            <TextField
              errorText={this.state.fieldErrors.passwordRepeat || false}
              floatingLabelText="Passwort wiederholen"
              fullWidth
              type="password"
              value={this.state.passwordRepeat}
              onChange={this.updatePasswordRepeat}
            /><br /><br />

            <RaisedButton
              className="PasswordReset__submit"
              fullWidth
              primary
              type="submit"
              label="Abschicken"
            />
          </form>
        </Paper>
      </Page>);
  }
}

PasswordReset.propTypes = {};

export default PasswordReset;
