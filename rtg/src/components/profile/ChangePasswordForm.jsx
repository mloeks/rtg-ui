import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RaisedButton } from 'material-ui';
import VisiblePasswordField from '../VisiblePasswordField';
import Notification, { NotificationType } from '../Notification';

import './ChangePasswordForm.css';

const ChangePasswordFormDisplay = props => (
  <div className="ChangePasswordForm">
    <h3 className="ChangePasswordForm__title">Passwort ändern</h3>

    <VisiblePasswordField
      floatingLabelText="Aktuelles Passwort"
      fullWidth
      value={props.oldPassword}
      errorText={props.oldPasswordError}
      onChange={(e, v) => props.onFieldChange('oldPassword', v)}
    /><br />
    <VisiblePasswordField
      floatingLabelText="Neues Passwort"
      fullWidth
      value={props.newPassword}
      errorText={props.newPasswordError}
      onChange={(e, v) => props.onFieldChange('newPassword', v)}
    /><br /><br />

    <div className="ChangePasswordForm__button-wrapper">
      <RaisedButton
        label={props.isSaving ? 'Speichern...' : 'Passwort ändern'}
        type="submit"
        primary
        disabled={props.isSaving || props.formHasErrors}
        style={{ width: 250 }}
      />
    </div>
  </div>
);

ChangePasswordFormDisplay.defaultProps = {
  oldPasswordError: '',
  newPasswordError: '',
};

ChangePasswordFormDisplay.propTypes = {
  oldPassword: PropTypes.string.isRequired,
  newPassword: PropTypes.string.isRequired,

  oldPasswordError: PropTypes.string,
  newPasswordError: PropTypes.string,

  isSaving: PropTypes.bool.isRequired,
  formHasErrors: PropTypes.bool.isRequired,

  onFieldChange: PropTypes.func.isRequired,
};

class ChangePasswordForm extends Component {
  static errorResponseToState(responseJson) {
    return {
      formHasErrors: true,
      fieldErrors: {
        oldPassword: responseJson.oldPassword && responseJson.oldPassword[0],
        newPassword: responseJson.newPassword && responseJson.newPassword[0],
      },
    };
  }

  static resetFieldErrors() {
    return {
      oldPassword: '',
      newPassword: '',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      newPassword: '',

      fieldErrors: ChangePasswordForm.resetFieldErrors(),

      formHasErrors: false,
      saving: false,
      savingError: false,
      savingSuccess: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormFieldUpdate = this.handleFormFieldUpdate.bind(this);
  }

  async handleSubmit(e) {
    console.log('TODO handleSubmit');

    e.preventDefault();
    this.setState({ saving: true, savingSuccess: false, savingError: false });

    // await this.patchData(
    //   `${API_BASE_URL}/rtg/users/${this.props.userId}/`,
    //   this.propsToUserPatchPayload(),
    //   this.props.onUserUpdate,
    //   ChangePasswordForm.userErrorResponseToState,
    // );

    this.setState({ saving: false });
  }

  handleFormFieldUpdate(fieldName, value) {
    this.setState({
      [fieldName]: value,

      fieldErrors: ChangePasswordForm.resetFieldErrors(),
      formHasErrors: false,
      savingError: false,
      savingSuccess: false,
    });
  }

  render() {
    return (
      <form className="ChangePasswordForm__form" onSubmit={this.handleSubmit} noValidate>
        <ChangePasswordFormDisplay
          oldPassword={this.state.oldPassword}
          newPassword={this.state.newPassword}

          oldPasswordError={this.state.fieldErrors.oldPassword}
          newPasswordError={this.state.fieldErrors.newPassword}

          isSaving={this.state.saving}
          formHasErrors={this.state.formHasErrors}

          onFieldChange={this.handleFormFieldUpdate}
        />

        {this.state.savingError &&
          <div className="ChangePasswordForm__save-feedback">
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle="Bitte prüfe Deine Eingaben oder versuche es später erneut."
            />
          </div>}
        {this.state.savingSuccess &&
          <div className="ChangePasswordForm__save-feedback">
            <Notification
              type={NotificationType.SUCCESS}
              title="Passwort erfolgreich geändert!"
              disappearAfterMs={5000}
            />
          </div>}
      </form>
    );
  }
};

export default ChangePasswordForm;
