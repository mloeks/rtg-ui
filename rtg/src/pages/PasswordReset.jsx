import React, { Component, Fragment } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import Page from './Page';
import AuthService from '../service/AuthService';
import BigPicture from '../components/BigPicture';
import Notification, { NotificationType } from '../components/Notification';
import VisiblePasswordField from '../components/VisiblePasswordField';

import headingImg from '../theme/img/headings/gate_head_emblem.jpg';
import './PasswordReset.css';

class PasswordReset extends Component {
  constructor(props) {
    super(props);

    this.getInitialState = this.getInitialState.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = this.getInitialState();
  }

  getInitialState() {
    const { match } = this.props;
    return {
      password: '',
      uid: match.params.uid,
      token: match.params.token,

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

  updatePassword(e) { this.updateFormField('password', e.target.value); }

  handleSubmit(e) {
    const { password, token, uid } = this.state;

    this.setState({ requestInProgress: true });
    AuthService.confirmPasswordReset(password, uid, token)
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
    const {
      fieldErrors,
      formError,
      formHasErrors,
      password,
      resetSuccessful,
    } = this.state;

    return (
      <Page className="PasswordResetPage">
        <BigPicture className="RulesPage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Neues Passwort vergeben</h1>
        </BigPicture>
        <Paper className="PasswordResetForm" elevation={6}>
          {!resetSuccessful && (
            <Fragment>
              <p style={{ textAlign: 'center' }}>Bitte gib Dein neues Passwort ein:</p>
              <form className="PasswordResetForm__form" onSubmit={this.handleSubmit}>
                <VisiblePasswordField
                  error={Boolean(fieldErrors.password)}
                  label="Passwort"
                  helperText={fieldErrors.password ? fieldErrors.password[0] : null}
                  fullWidth
                  value={password}
                  onChange={this.updatePassword}
                />
                <br />
                <br />

                <Button
                  className="PasswordReset__submit"
                  color="primary"
                  fullWidth
                  variant="contained"
                  type="submit"
                >
                  Abschicken
                </Button>
              </form>
            </Fragment>
          )}

          {resetSuccessful === true && (
            <Fragment>
              <Notification
                type={NotificationType.SUCCESS}
                title="Neues Passwort erfolgreich festgelegt"
                subtitle="Du kannst dich nun mit deinem neuen Passwort einloggen."
              />
              <br />
              <Link to="/">
                <Button color="primary">Zum Login</Button>
              </Link>
            </Fragment>
          )}

          {formHasErrors && (
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle={formError}
              containerStyle={{ marginTop: 20 }}
            />
          )}

          {(fieldErrors.uid || fieldErrors.token) && (
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle="Der Link wurde bereits verwendet, ist anderweitig ungültig oder abgelaufen."
              containerStyle={{ marginTop: 20 }}
            />
          )}
        </Paper>
      </Page>);
  }
}

PasswordReset.propTypes = {
  // eslint-disable-next-line react/no-typos
  match: ReactRouterProptypes.match.isRequired,
};

export default PasswordReset;
