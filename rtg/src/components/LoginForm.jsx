import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatButton, RaisedButton } from 'material-ui';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';
import RegisterDialog from './RegisterDialog';

import './LoginForm.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      fieldErrors: {
        username: null,
        password: null,
      },
      formError: null,
      formHasErrors: false,

      registerModalOpen: false,
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.loginErrorCallback = this.loginErrorCallback.bind(this);
    this.validate = this.validate.bind(this);

    this.handleRegisterButtonClicked = this.handleRegisterButtonClicked.bind(this);
    this.handleRegisterCancel = this.handleRegisterCancel.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
  }

  updateUsername(event, newValue) {
    this.setState({ formError: null, formHasErrors: false, username: newValue });
  }

  updatePassword(event, newValue) {
    this.setState({ formError: null, formHasErrors: false, password: newValue });
  }

  handleLogin(event) {
    this.validate(() => {
      if (!this.state.formHasErrors) {
        this.props.onLogin(this.state.username, this.state.password, this.loginErrorCallback);
      }
    });
    event.preventDefault();
  }

  loginErrorCallback(error) {
    this.setState({ formError: error.message });
  }

  validate(callback) {
    this.setState((prevState) => {
      let formHasErrors = false;
      const fieldErrors = {};
      if (!prevState.username || prevState.username.length === 0) {
        formHasErrors = true;
        fieldErrors.username = 'Bitte E-Mail oder Username eingeben.';
      }
      if (!prevState.password || prevState.password.length === 0) {
        formHasErrors = true;
        fieldErrors.password = 'Bitte Passwort eingeben.';
      }
      return { formHasErrors, fieldErrors };
    }, callback);
  }

  handleRegisterButtonClicked() {
    this.setState({ registerModalOpen: true });
  }

  handleRegisterSubmit(username, password) {
    this.setState({ registerModalOpen: false }, () => {
      this.props.onLogin(username, password, this.loginErrorCallback);
    });
  }

  handleRegisterCancel() {
    this.setState({ registerModalOpen: false });
  }

  render() {
    return (
      <Paper className="LoginForm" zDepth={1}>
        <h3 className="LoginForm__heading">Bitte treten Sie ein:</h3>
        <form className="LoginForm__form" onSubmit={this.handleLogin}>
          <TextField
            errorText={this.state.fieldErrors.username || false}
            floatingLabelText="E-Mail / Username"
            fullWidth
            onChange={this.updateUsername}
          />
          <br />
          <TextField
            errorText={this.state.fieldErrors.password || false}
            floatingLabelText="Passwort"
            fullWidth
            type="password"
            onChange={this.updatePassword}
          />
          <br /><br />

          <RaisedButton
            className="LoginForm__button"
            fullWidth
            primary
            type="submit"
            label="Eintreten"
          /><br />

          {this.state.formError &&
          <div
            className="LoginForm__formError"
            style={{ color: this.props.muiTheme.palette.errorColor }}
          >{this.state.formError}
          </div>}

          <br />
          <div className="LoginForm__second-button-row">
            <FlatButton label="Registrieren" onClick={this.handleRegisterButtonClicked} />
            <RegisterDialog
              open={this.state.registerModalOpen}
              onCancel={this.handleRegisterCancel}
              onSubmit={this.handleRegisterSubmit}
            />

            <FlatButton label="Passwort vergessen" />
          </div>
        </form>
      </Paper>);
  }
}

LoginForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default muiThemeable()(LoginForm);
