import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterProptypes from 'react-router-prop-types';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';
import Page from './Page';
import AuthService from '../service/AuthService';
import BigPicture from '../components/BigPicture';
import VisiblePasswordField from '../components/VisiblePasswordField';

import headingImg from '../theme/img/headings/gate_head_emblem.jpg';
import './PasswordReset.css';

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
      uid: this.props.match.params.uid,
      token: this.props.match.params.token,

      requestInProgress: false,
      resetSuccessful: false,

      fieldErrors: { password: null },

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
    AuthService.confirmPasswordReset(this.state.password, this.state.uid, this.state.token)
      .then(() => {
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
    const formSuccessStyle = { color: this.props.theme.palette.success, marginTop: '20px', textAlign: 'center' };
    const formErrorStyle = { color: this.props.theme.palette.error.main, marginTop: '20px', textAlign: 'center' };

    return (
      <Page className="PasswordResetPage">
        <BigPicture className="RulesPage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Neues Passwort vergeben</h1>
        </BigPicture>
        <Paper className="PasswordResetForm" zDepth={1}>
          <p style={{ textAlign: 'center' }}>Bitte gib Dein neues Passwort ein:</p>
          <form className="PasswordResetForm__form" onSubmit={this.handleSubmit}>
            <VisiblePasswordField
              errorText={this.state.fieldErrors.password || false}
              floatingLabelText="Passwort"
              fullWidth
              value={this.state.password}
              onChange={this.updatePassword}
            /><br /><br />

            <Button
              variant="raised"
              className="PasswordReset__submit"
              fullWidth
              color="primary"
              type="submit"
            >
              Abschicken
            </Button>
          </form>

          {this.state.resetSuccessful === true &&
          <div className="PasswordReset__resetSuccess" style={formSuccessStyle}>
            Vielen Dank, du kannst dich nun mit deinem neuen Passwort einloggen.<br />
            <Link to="/">
              <Button style={{ marginTop: '20px' }}>Zum Login</Button>
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
  theme: PropTypes.object.isRequired,
};

export default withTheme()(PasswordReset);
