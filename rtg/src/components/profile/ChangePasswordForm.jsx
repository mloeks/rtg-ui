import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import VisiblePasswordField from '../VisiblePasswordField';
import Notification, { NotificationType } from '../Notification';
import AuthService from '../../service/AuthService';

import './ChangePasswordForm.scss';

const ChangePasswordFormDisplay = ({
  formHasErrors, isSaving, newPassword, newPasswordError,
  oldPassword, oldPasswordError, onFieldChange,
}) => (
  <div className="ChangePasswordForm">
    <h3 className="ChangePasswordForm__title">Passwort ändern</h3>

    <VisiblePasswordField
      label="Aktuelles Passwort"
      fullWidth
      value={oldPassword}
      error={Boolean(oldPasswordError)}
      helperText={oldPasswordError}
      onChange={(e) => onFieldChange('oldPassword', e.target.value)}
    />
    <VisiblePasswordField
      label="Neues Passwort"
      fullWidth
      value={newPassword}
      error={Boolean(newPasswordError)}
      helperText={newPasswordError}
      onChange={(e) => onFieldChange('newPassword', e.target.value)}
    />
    <br />
    <br />

    <div className="ChangePasswordForm__button-wrapper">
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isSaving || formHasErrors}
        style={{ width: 250 }}
      >
        {isSaving ? 'Speichern...' : 'Passwort ändern'}
      </Button>
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
  static getInitialState() {
    return {
      oldPassword: '',
      newPassword: '',

      fieldErrors: ChangePasswordForm.resetFieldErrors(),
      nonFieldError: '',

      formHasErrors: false,
      saving: false,
      savingError: false,
      savingSuccess: false,
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
    this.state = ChangePasswordForm.getInitialState();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormFieldUpdate = this.handleFormFieldUpdate.bind(this);
  }

  async handleSubmit(e) {
    const { newPassword, oldPassword } = this.state;

    e.preventDefault();
    this.setState({ saving: true, savingSuccess: false, savingError: false });

    AuthService.changePassword(oldPassword, newPassword)
      .then(() => this.setState({ ...ChangePasswordForm.getInitialState(), savingSuccess: true }))
      .catch((loginErr) => this.setState({
        saving: false,
        savingError: true,
        nonFieldError: loginErr.message,
        fieldErrors: loginErr.fieldErrors,
      }));
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
    const {
      fieldErrors,
      formHasErrors,
      newPassword,
      nonFieldError,
      oldPassword,
      saving,
      savingError,
      savingSuccess,
    } = this.state;

    return (
      <form className="ChangePasswordForm__form" onSubmit={this.handleSubmit} noValidate>
        <ChangePasswordFormDisplay
          oldPassword={oldPassword}
          newPassword={newPassword}
          oldPasswordError={fieldErrors.oldPassword}
          newPasswordError={fieldErrors.newPassword}
          isSaving={saving}
          formHasErrors={formHasErrors}
          onFieldChange={this.handleFormFieldUpdate}
        />

        {(savingError && !formHasErrors) && (
          <div className="ChangePasswordForm__save-feedback">
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle={nonFieldError || 'Bitte versuche es erneut.'}
            />
          </div>
        )}
        {savingSuccess && (
          <div className="ChangePasswordForm__save-feedback">
            <Notification
              type={NotificationType.SUCCESS}
              title="Passwort erfolgreich geändert!"
              disappearAfterMs={5000}
            />
          </div>
        )}
      </form>
    );
  }
}

export default ChangePasswordForm;
