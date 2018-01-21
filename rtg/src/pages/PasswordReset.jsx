import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterProptypes from 'react-router-prop-types';
import { FlatButton, Paper, RaisedButton, TextField } from 'material-ui';
import { Link } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Page from './Page';
import AuthService from '../service/AuthService';

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
      uid: this.props.match.params.uid,
      token: this.props.match.params.token,

      requestInProgress: false,
      resetSuccessful: false,

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
    this.setState({ requestInProgress: true });
    AuthService.confirmPasswordReset(
      this.state.password, this.state.passwordRepeat,
      this.state.uid, this.state.token,
    ).then(() => {
      this.setState({
        ...this.getInitialState(), resetSuccessful: true, requestInProgress: false,
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
    e.preventDefault();
  }

  render() {
    const formSuccessStyle = { color: this.props.muiTheme.palette.successColor, marginTop: '20px', textAlign: 'center' };
    const formErrorStyle = { color: this.props.muiTheme.palette.errorColor, marginTop: '20px', textAlign: 'center' };

    return (
      <Page className="PasswordResetPage">
        <h1>Neues Passwort vergeben</h1>
        <Paper
          className="PasswordResetForm"
          zDepth={1}
          style={{ margin: '0 auto 100px', padding: '20px', width: '50%', textAlign: 'left' }}
        >
          <p style={{ textAlign: 'center' }}>Bitte gib Dein neues Passwort zweimal ein:</p>
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

          {this.state.resetSuccessful === true &&
          <div className="PasswordReset__resetSuccess" style={formSuccessStyle}>
            Vielen Dank, du kannst dich nun mit deinem neuen Passwort einloggen.<br />
            <Link to="/">
              <FlatButton label="Zum Login" style={{ marginTop: '20px' }} />
            </Link>
          </div>}

          {this.state.formHasErrors &&
          <div className="PasswordReset__formError" style={formErrorStyle}>
            {this.state.formError}
          </div>}

          {(this.state.fieldErrors.uid || this.state.fieldErrors.token) &&
          <div className="PasswordReset__tokenError" style={formErrorStyle}>
            Es tut uns Leid, aber der Link wurde bereits verwendet,
            ist anderweitig ungültig oder abgelaufen.
          </div>}
        </Paper>
      </Page>);
  }
}

PasswordReset.propTypes = {
  // eslint-disable-next-line react/no-typos
  match: ReactRouterProptypes.match.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(PasswordReset);
