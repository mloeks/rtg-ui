import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';
import VisiblePasswordField from './VisiblePasswordField';
import RegisterDialog from './RegisterDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';

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
      passwordForgotDialogOpen: false,
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.loginErrorCallback = this.loginErrorCallback.bind(this);
    this.validate = this.validate.bind(this);
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

  render() {
    return (
      <Paper className="LoginForm" zDepth={3}>
        <h3 className="LoginForm__heading">Bitte eintreten:</h3>
        <form className="LoginForm__form" onSubmit={this.handleLogin}>
          <TextField
            errorText={this.state.fieldErrors.username || false}
            floatingLabelText="E-Mail / Username"
            fullWidth
            onChange={this.updateUsername}
          />
          <br />
          <VisiblePasswordField
            errorText={this.state.fieldErrors.password || false}
            floatingLabelText="Passwort"
            fullWidth
            onChange={this.updatePassword}
          />
          <br />
          <br />

          <Button
            variant="raised"
            className="LoginForm__button"
            fullWidth
            color="primary"
            type="submit"
          >
            Eintreten
          </Button>
          <br />

          {this.state.formError &&
          <div
            className="LoginForm__formError"
            style={{ color: this.props.muiTheme.palette.errorColor }}
          >{this.state.formError}
          </div>}
        </form>

        <br />
        <div className="LoginForm__second-button-row">
          <Button onClick={() => { this.setState({ registerModalOpen: true }); }}>
            Registrieren
          </Button>
          <RegisterDialog
            open={this.state.registerModalOpen}
            onCancel={() => { this.setState({ registerModalOpen: false }); }}
          />

          <Button onClick={() => { this.setState({ passwordForgotDialogOpen: true }); }}>
            Passwort vergessen
          </Button>
          <ForgotPasswordDialog
            open={this.state.passwordForgotDialogOpen}
            onClose={() => { this.setState({ passwordForgotDialogOpen: false }); }}
          />
        </div>
      </Paper>);
  }
}

LoginForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default muiThemeable()(LoginForm);
