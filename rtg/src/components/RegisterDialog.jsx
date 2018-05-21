import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Dialog, FlatButton, TextField } from 'material-ui';
import AuthService from '../service/AuthService';
import VisiblePasswordField from './VisiblePasswordField';
import Notification, { NotificationType } from './Notification';
import { lightGrey } from '../theme/RtgTheme';

// TODO P2 confirm on enter
// TODO P3 fix error messages "darf nicht null sein"
class RegisterDialog extends Component {
  static getInitialState() {
    return {
      registerSuccessful: false,

      username: null,
      password: null,
      firstName: null,
      lastName: null,
      email: null,

      fieldErrors: {
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        email: null,
      },
      formError: null,
      formHasErrors: false,

      hasChanges: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = RegisterDialog.getInitialState();

    this.updateFormField = this.updateFormField.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // reset my state on open
    if (nextProps.open === true) {
      this.setState(RegisterDialog.getInitialState);
    }
  }

  updateFormField(fieldName, newValue) {
    const newState = { formError: null, formHasErrors: false, hasChanges: true };
    newState[fieldName] = newValue;
    this.setState(newState);
  }

  updateUsername(event, newValue) { this.updateFormField('username', newValue); }
  updatePassword(event, newValue) { this.updateFormField('password', newValue); }
  updateFirstName(event, newValue) { this.updateFormField('firstName', newValue); }
  updateLastName(event, newValue) { this.updateFormField('lastName', newValue); }
  updateEmail(event, newValue) { this.updateFormField('email', newValue); }

  handleSubmit() {
    AuthService.register(
      this.state.username, this.state.email, this.state.password,
      this.state.firstName, this.state.lastName,
    ).then(() => {
      this.setState({ registerSuccessful: true });
    })
      .catch((errors) => {
        this.setState({
          fieldErrors: errors.fieldErrors || {},
          formHasErrors: errors.nonFieldError,
          formError: errors.nonFieldError,
        });
      });
  }

  render() {
    if (this.state.registerSuccessful) {
      return (<Redirect to="/foyer" />);
    }

    const actions = [
      <FlatButton label="Abbrechen" secondary onClick={this.props.onCancel} />,
      <FlatButton
        label="Registrieren"
        primary
        disabled={!this.state.hasChanges}
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        className="RegisterDialog"
        actions={actions}
        autoScrollBodyContent
        modal
        open={this.props.open}
        repositionOnUpdate={false}
        title={
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '10px auto' }}>Werde Teil der RTG</h3>
            {this.state.formHasErrors &&
              <Notification
                type={NotificationType.ERROR}
                title={this.state.formError}
                subtitle="Bitte versuche es erneut."
              />}
          </div>}
        style={{ textAlign: 'left', paddingTop: 0 }}
        titleStyle={{ padding: '12px' }}
        contentStyle={{ padding: '10px', width: '100%', transform: 'translate(0, 0)' }}
      >

        <TextField
          errorText={this.state.fieldErrors.username || false}
          floatingLabelText="Username"
          fullWidth
          onChange={this.updateUsername}
        />
        <br />
        <TextField
          errorText={this.state.fieldErrors.email || false}
          floatingLabelText="E-Mail"
          fullWidth
          onChange={this.updateEmail}
        />
        <br />
        <VisiblePasswordField
          errorText={this.state.fieldErrors.password || false}
          floatingLabelText="Passwort"
          fullWidth
          onChange={this.updatePassword}
        />
        <div style={{ display: 'flex' }}>
          <TextField
            style={{ marginRight: '10px', width: '50%' }}
            errorText={this.state.fieldErrors.firstName || false}
            floatingLabelText="Vorname"
            onChange={this.updateFirstName}
          />
          <TextField
            style={{ marginLeft: '10px', width: '50%' }}
            errorText={this.state.fieldErrors.lastName || false}
            floatingLabelText="Nachname"
            onChange={this.updateLastName}
          />
        </div><br />
        <p style={{ margin: 0, color: lightGrey, fontSize: '14px' }}>
          Wir benötigen deinen echten Namen nur, um deine royale Identität zu prüfen.
          Dein Name ist nicht für andere Mitspieler sichtbar.
        </p>
      </Dialog>
    );
  }
}

RegisterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RegisterDialog;
