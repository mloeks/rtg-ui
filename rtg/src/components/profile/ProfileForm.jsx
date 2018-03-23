import React, { Component } from 'react';
import { CircularProgress } from 'material-ui';
import ProfileFormDisplay from './ProfileFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';

// TODO P1 Style success and error responses
// TODO P2 make e-mail changeable --> probably needs a re-login? evaluate..
class ProfileForm extends Component {
  static userToStateMapper(userJson) {
    return {
      userId: userJson.pk,
      username: userJson.username,
      firstName: userJson.first_name,
      lastName: userJson.last_name,
      email: userJson.email,
      email2: userJson.email2,
      location: userJson.location,
      about: userJson.about,
      reminderEmails: userJson.reminder_emails,
      dailyEmails: userJson.daily_emails,
    };
  }

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
      email2: null,
      firstName: null,
      lastName: null,
      about: null,
      location: null,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      username: null,
      email: null,
      email2: null,
      firstName: null,
      lastName: null,
      about: null,
      location: null,

      dailyEmails: true,
      reminderEmails: true,

      loading: true,
      saving: false,
      loadingError: false,
      savingError: false,
      savingSuccess: false,

      formHasErrors: false,
      fieldErrors: ProfileForm.resetFieldErrors(),
    };

    this.handleFormFieldUpdate = this.handleFormFieldUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.stateToUserPatchPayload = this.stateToUserPatchPayload.bind(this);
  }

  componentDidMount() {
    fetch(`${API_BASE_URL}/rtg/users/${AuthService.getUserId()}/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => ({
          loading: false,
          ...(response.ok ? ProfileForm.userToStateMapper(response.json)
            : { loadingError: true }
          ),
        }));
      }).catch(() => this.setState({ loadingError: true, loading: false }));
  }

  stateToUserPatchPayload() {
    return {
      pk: this.state.userId,
      email2: this.state.email2,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      about: this.state.about,
      location: this.state.location,
      reminder_emails: this.state.reminderEmails,
      daily_emails: this.state.dailyEmails,
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
      `${API_BASE_URL}/rtg/users/${this.state.userId}/`,
      this.stateToUserPatchPayload(),
      ProfileForm.userToStateMapper,
      ProfileForm.userErrorResponseToState,
    );

    this.setState({ saving: false });
  }

  handleFormFieldUpdate(fieldName, value) {
    this.setState({
      [fieldName]: value,
      formHasErrors: false,
      fieldErrors: ProfileForm.resetFieldErrors(),
    });
  }

  render() {
    return (
      <form className="ProfileForm__container" onSubmit={this.handleSubmit} noValidate>
        {this.state.loading && <CircularProgress className="ProfileForm__loading-spinner" />}

        {this.state.loadingError &&
          <div className="ProfileForm__loading-error">Fehler beim Laden.</div>}

        {(!this.state.loading && !this.state.loadingError) &&
          <ProfileFormDisplay
            about={this.state.about}
            dailyEmails={this.state.dailyEmails}
            email={this.state.email}
            email2={this.state.email2}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            location={this.state.location}
            reminderEmails={this.state.reminderEmails}

            aboutError={this.state.fieldErrors.about}
            dailyEmailsError={this.state.fieldErrors.dailyEmails}
            email2Error={this.state.fieldErrors.email2}
            firstNameError={this.state.fieldErrors.firstName}
            lastNameError={this.state.fieldErrors.lastName}
            locationError={this.state.fieldErrors.location}
            reminderEmailsError={this.state.fieldErrors.reminderEmails}

            isSaving={this.state.saving}

            onFieldChange={this.handleFormFieldUpdate}
          />
        }

        {this.state.savingError &&
          <div className="ProfileForm__saving-error">Speichern fehlgeschlagen.</div>}
        {this.state.savingSuccess &&
          <div className="ProfileForm__saving-success">Änderungen erfolgreich gespeichert!</div>}
      </form>
    );
  }
}

export default ProfileForm;
