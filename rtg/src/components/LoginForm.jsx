import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

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
      formHasErrors: false,
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.validate = this.validate.bind(this);
  }

  updateUsername(event, newValue) {
    this.setState({username: newValue});
  }

  updatePassword(event, newValue) {
    this.setState({password: newValue});
  }

  handleLogin(event) {
    this.validate(() => {
      if (!this.state.formHasErrors) {
        this.props.onLogin(this.state.username, this.state.password);
      }
    });
    event.preventDefault();
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
          />
        </form>
      </Paper>);
  }
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
