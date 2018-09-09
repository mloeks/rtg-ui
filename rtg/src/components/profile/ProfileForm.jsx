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

  stateToUserPatchPayload() {
    return {
      pk: this.props.userId,
      email: this.state.user.email || '',
      email2: this.state.user.email2 || '',
      first_name: this.state.user.firstName || '',
      last_name: this.state.user.lastName || '',
      about: this.state.user.about || '',
      location: this.state.user.location || '',
      reminder_emails: this.state.user.reminderEmails,
      daily_emails: this.state.user.dailyEmails,
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
      this.stateToUserPatchPayload(),
      this.props.onUserUpdate,
      ProfileForm.userErrorResponseToState,
    );

    this.setState({ saving: false });
  }

  handleFormFieldUpdate(fieldName, value) {
    this.setState((prevState) => {
      const updatedUser = Object.assign({}, prevState.user);
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

        {(!this.props.loading && !this.props.loadingError && this.state.user) &&
          <ProfileFormDisplay
            about={this.state.user.about}
            dailyEmails={this.state.user.dailyEmails}
            email={this.state.user.email}
            email2={this.state.user.email2}
            firstName={this.state.user.firstName}
            lastName={this.state.user.lastName}
            location={this.state.user.location}
            reminderEmails={this.state.user.reminderEmails}

            aboutError={this.state.fieldErrors.about}
            dailyEmailsError={this.state.fieldErrors.dailyEmails}
            emailError={this.state.fieldErrors.email}
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
