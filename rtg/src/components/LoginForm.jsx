import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withTheme } from '@material-ui/core/styles';
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
    const { onLogin } = this.props;
    const { formHasErrors, password, username } = this.state;

    this.validate(() => {
      if (!formHasErrors) {
        onLogin(username, password, this.loginErrorCallback);
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
    const { theme } = this.props;
    const {
      fieldErrors,
      formError,
      passwordForgotDialogOpen,
      registerModalOpen,
    } = this.state;

    return (
      <Paper className="LoginForm" elevation={12}>
        <h3 className="LoginForm__heading">Bitte eintreten:</h3>
        <form className="LoginForm__form" onSubmit={this.handleLogin}>
          <br />
          <TextField
            autoFocus
            error={fieldErrors.username}
            fullWidth
            helperText={fieldErrors.username || false}
            label="E-Mail / Username"
            onChange={this.updateUsername}
          />
          <br />
          <br />
          <VisiblePasswordField
            error={fieldErrors.password || false}
            fullWidth
            helperText={fieldErrors.password || false}
            label="Passwort"
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

          {formError && (
            <div
              className="LoginForm__formError"
              style={{ color: theme.palette.error.main }}
            >
              {formError}
            </div>
          )}
        </form>

        <br />
        <div className="LoginForm__second-button-row">
          <Button onClick={() => { this.setState({ registerModalOpen: true }); }}>
            Registrieren
          </Button>
          <RegisterDialog
            open={registerModalOpen}
            onCancel={() => { this.setState({ registerModalOpen: false }); }}
          />

          <Button onClick={() => { this.setState({ passwordForgotDialogOpen: true }); }}>
            Passwort vergessen
          </Button>
          <ForgotPasswordDialog
            open={passwordForgotDialogOpen}
            onClose={() => { this.setState({ passwordForgotDialogOpen: false }); }}
          />
        </div>
      </Paper>);
  }
}

LoginForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default withTheme()(LoginForm);
