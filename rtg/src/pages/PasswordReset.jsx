import React, { Component } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import { Paper, RaisedButton, TextField } from 'material-ui';
import Page from './Page';

class PasswordReset extends Component {
  constructor(props) {
    super(props);

    this.getInitialState = this.getInitialState.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePasswordRepeat = this.updatePasswordRepeat.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      password: '',
      passwordRepeat: '',
      uid: this.props.match.uid,
      token: this.props.match.token,

      fieldErrors: {
        password: null,
        passwordRepeat: null,
      },

      formHasErrors: false,
      formError: null,
    };
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
    this.setState(this.getInitialState());
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

PasswordReset.propTypes = {
  // eslint-disable-next-line react/no-typos
  match: ReactRouterProptypes.match.isRequired,
};

export default PasswordReset;
