import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { withTheme } from '@mui/material/styles';
import VisiblePasswordField from './VisiblePasswordField';
import RegisterDialog from './RegisterDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';

import './LoginForm.scss';

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

  updateUsername(e) {
    this.setState({ formError: null, formHasErrors: false, username: e.target.value });
  }

  updatePassword(e) {
    this.setState({ formError: null, formHasErrors: false, password: e.target.value });
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
      password,
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
            error={Boolean(fieldErrors.username)}
            fullWidth
            helperText={fieldErrors.username || false}
            label="E-Mail / Username"
            onChange={this.updateUsername}
          />
          <br />
          <br />
          <VisiblePasswordField
            error={Boolean(fieldErrors.password)}
            fullWidth
            helperText={fieldErrors.password}
            value={password || ''}
            onChange={this.updatePassword}
          />
          <br />
          <br />

          <Button
            variant="contained"
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
          <Button className="LoginForm__register qa-register-button" onClick={() => { this.setState({ registerModalOpen: true }); }}>
            Registrieren
          </Button>
          {registerModalOpen && (
            <RegisterDialog onCancel={() => { this.setState({ registerModalOpen: false }); }} />
          )}

          <Button className="LoginForm__forgot-password" onClick={() => { this.setState({ passwordForgotDialogOpen: true }); }}>
            Passwort vergessen
          </Button>
          {passwordForgotDialogOpen && (
            <ForgotPasswordDialog
              onClose={() => { this.setState({ passwordForgotDialogOpen: false }); }}
            />
          )}
        </div>
      </Paper>
    );
  }
}

LoginForm.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onLogin: PropTypes.func.isRequired,
};

export default withTheme(LoginForm);
