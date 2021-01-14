import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProfileFormDisplay from './ProfileFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import Notification, { NotificationType } from '../Notification';

class ProfileForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.user && nextProps.user) {
      return { user: nextProps.user };
    }
    return null;
  }

  static userErrorResponseToState(responseJson) {
    return {
      formHasErrors: true,
      fieldErrors: {
        email: responseJson.email && responseJson.email[0],
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
      email: '',
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
      user: null,

      saving: false,
      savingError: false,
      savingSuccess: false,

      formHasErrors: false,
      fieldErrors: ProfileForm.resetFieldErrors(),
    };

    this.handleFormFieldUpdate = this.handleFormFieldUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.stateToUserPatchPayload = this.stateToUserPatchPayload.bind(this);
  }

  async handleSubmit(e) {
    const { onUserUpdate, userId } = this.props;

    e.preventDefault();
    this.setState({ saving: true, savingSuccess: false, savingError: false });

    await this.patchData(
      `${API_BASE_URL}/rtg/users/${userId}/`,
      this.stateToUserPatchPayload(),
      onUserUpdate,
      ProfileForm.userErrorResponseToState,
    );

    this.setState({ saving: false });
  }

  handleFormFieldUpdate(fieldName, value) {
    this.setState((prevState) => {
      const updatedUser = { ...prevState.user };
      updatedUser[fieldName] = value;

      return {
        user: updatedUser,
        formHasErrors: false,
        savingError: false,
        savingSuccess: false,
        fieldErrors: ProfileForm.resetFieldErrors(),
      };
    });
  }

  stateToUserPatchPayload() {
    const { user } = this.state;
    const { userId } = this.props;

    return {
      pk: userId,
      email: user.email || '',
      email2: user.email2 || '',
      first_name: user.firstName || '',
      last_name: user.lastName || '',
      about: user.about || '',
      location: user.location || '',
      reminder_emails: user.reminderEmails,
      daily_emails: user.dailyEmails,
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

  render() {
    const {
      fieldErrors,
      formHasErrors,
      saving,
      savingError,
      savingSuccess,
      user,
    } = this.state;
    const { loading, loadingError } = this.props;

    return (
      <form
        className="ProfileForm__container qa-profile-form"
        onSubmit={this.handleSubmit}
        autoComplete="off"
        noValidate
      >
        {loading && <CircularProgress className="ProfileForm__loading-spinner" />}

        {loadingError && (
          <div className="ProfileForm__loading-error">
            <Notification
              type={NotificationType.ERROR}
              title="Fehler beim Laden."
              subtitle="Bitte versuche es später erneut."
            />
          </div>
        )}

        {(!loading && !loadingError && user) && (
          <ProfileFormDisplay
            about={user.about}
            dailyEmails={user.dailyEmails}
            email={user.email}
            email2={user.email2}
            firstName={user.firstName}
            lastName={user.lastName}
            location={user.location}
            reminderEmails={user.reminderEmails}
            aboutError={fieldErrors.about}
            dailyEmailsError={fieldErrors.dailyEmails}
            emailError={fieldErrors.email}
            email2Error={fieldErrors.email2}
            firstNameError={fieldErrors.firstName}
            lastNameError={fieldErrors.lastName}
            locationError={fieldErrors.location}
            reminderEmailsError={fieldErrors.reminderEmails}
            isSaving={saving}
            formHasErrors={formHasErrors}
            onFieldChange={this.handleFormFieldUpdate}
          />
        )}

        {savingError && (
          <div className="ProfileForm__save-feedback ProfileForm__saving-error">
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle="Bitte prüfe Deine Eingaben oder versuche es später erneut."
            />
          </div>
        )}
        {savingSuccess && (
          <div className="ProfileForm__save-feedback ProfileForm__saving-success qa-profile-save-success">
            <Notification
              type={NotificationType.SUCCESS}
              title="Änderungen erfolgreich gespeichert!"
              disappearAfterMs={5000}
            />
          </div>
        )}
      </form>
    );
  }
}

ProfileForm.defaultProps = {
  user: null,
  onUserUpdate: () => {},
};

ProfileForm.propTypes = {
  userId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    email2: PropTypes.string,
    about: PropTypes.string,
    location: PropTypes.string,

    reminderEmails: PropTypes.bool.isRequired,
    dailyEmails: PropTypes.bool.isRequired,
  }),

  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.bool.isRequired,

  onUserUpdate: PropTypes.func,
};

export default ProfileForm;
