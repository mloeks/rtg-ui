import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui';
import ProfileFormDisplay from './ProfileFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import Notification, { NotificationType } from '../Notification';

// TODO P2 make e-mail changeable --> probably needs a re-login? evaluate..
class ProfileForm extends Component {
  static userErrorResponseToState(responseJson) {
    return {
      formHasErrors: true,
      fieldErrors: {
        email2: responseJson.email2 && responseJson.email2[0],
        firstName: responseJson.firstName && responseJson.firstName[0],
        lastName: responseJson.lastName && responseJson.lastName[0],
        about: responseJson.about && responseJson.about[0],
        location: responseJson.location && responseJson.location[0],
      },
    };
  }

  static resetFieldErrors() {
    return {
      email2: '',
      firstName: '',
      lastName: '',
      about: '',
      location: '',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      savingError: false,
      savingSuccess: false,

      formHasErrors: false,
      fieldErrors: ProfileForm.resetFieldErrors(),
    };

    this.handleFormFieldUpdate = this.handleFormFieldUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.propsToUserPatchPayload = this.propsToUserPatchPayload.bind(this);
  }

  propsToUserPatchPayload() {
    return {
      pk: this.props.userId,
      email2: this.props.email2 || '',
      first_name: this.props.firstName || '',
      last_name: this.props.lastName || '',
      about: this.props.about || '',
      location: this.props.location || '',
      reminder_emails: this.props.reminderEmails,
      daily_emails: this.props.dailyEmails,
    };
  }

  async patchData(url, payload, successResponseToStateMapper, errorResponseToStateMapper) {
    return fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Token ${AuthService.getToken()}`,
        'content-type': 'application/json',
      },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? { savingSuccess: true, ...successResponseToStateMapper(response.json) }
            : { savingError: true, ...errorResponseToStateMapper(response.json) }
        ));
      }).catch(() => this.setState({ savingError: true }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ saving: true, savingSuccess: false, savingError: false });

    await this.patchData(
      `${API_BASE_URL}/rtg/users/${this.props.userId}/`,
      this.propsToUserPatchPayload(),
      this.props.onUserUpdate,
      ProfileForm.userErrorResponseToState,
    );

    this.setState({ saving: false });
  }

  handleFormFieldUpdate(fieldName, value) {
    this.setState((prevState, prevProps) => {
      prevProps.onFieldChange(fieldName, value);

      return {
        formHasErrors: false,
        savingError: false,
        savingSuccess: false,
        fieldErrors: ProfileForm.resetFieldErrors(),
      };
    });
  }

  render() {
    return (
      <form className="ProfileForm__container" onSubmit={this.handleSubmit} noValidate>
        {this.props.loading && <CircularProgress className="ProfileForm__loading-spinner" />}

        {this.props.loadingError &&
          <div className="ProfileForm__loading-error">
            <Notification
              type={NotificationType.ERROR}
              title="Fehler beim Laden."
              subtitle="Bitte versuche es später erneut."
            />
          </div>}

        {(!this.props.loading && !this.props.loadingError) &&
          <ProfileFormDisplay
            about={this.props.about}
            dailyEmails={this.props.dailyEmails}
            email={this.props.email}
            email2={this.props.email2}
            firstName={this.props.firstName}
            lastName={this.props.lastName}
            location={this.props.location}
            reminderEmails={this.props.reminderEmails}

            aboutError={this.state.fieldErrors.about}
            dailyEmailsError={this.state.fieldErrors.dailyEmails}
            email2Error={this.state.fieldErrors.email2}
            firstNameError={this.state.fieldErrors.firstName}
            lastNameError={this.state.fieldErrors.lastName}
            locationError={this.state.fieldErrors.location}
            reminderEmailsError={this.state.fieldErrors.reminderEmails}

            isSaving={this.state.saving}
            formHasErrors={this.state.formHasErrors}

            onFieldChange={this.handleFormFieldUpdate}
          />
        }

        {this.state.savingError &&
          <div className="ProfileForm__save-feedback ProfileForm__saving-error">
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle="Bitte prüfe Deine Eingaben oder versuche es später erneut."
            />
          </div>}
        {this.state.savingSuccess &&
          <div className="ProfileForm__save-feedback ProfileForm__saving-success">
            <Notification
              type={NotificationType.SUCCESS}
              title="Änderungen erfolgreich gespeichert!"
              disappearAfterMs={5000}
            />
          </div>}
      </form>
    );
  }
}

ProfileForm.propTypes = {
  userId: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  email2: PropTypes.string.isRequired,
  about: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,

  reminderEmails: PropTypes.bool.isRequired,
  dailyEmails: PropTypes.bool.isRequired,

  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.bool.isRequired,

  onFieldChange: PropTypes.func.isRequired,
  onUserUpdate: PropTypes.func.isRequired,
};

export default ProfileForm;
