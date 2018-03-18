import React, { Component } from 'react';
import { CircularProgress } from 'material-ui';
import ProfileFormDisplay from './ProfileFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';

// TODO handle save and its success / error responses + styling
class ProfileForm extends Component {
  static userToStateMapper(userJson) {
    return {
      username: userJson.username,
      firstName: userJson.first_name,
      lastName: userJson.last_name,
      email: userJson.email,
    };
  }

  static profileToStateMapper(userJson) {
    return {
      email2: userJson.email2,
      location: userJson.location,
      about: userJson.about,
      reminderEmails: userJson.reminder_emails,
      dailyEmails: userJson.daily_emails,
      avatarUrl: userJson.avatar_cropped,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
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
      formError: '',

      formFieldErrors: {
        username: null,
        email: null,
        email2: null,
        firstName: null,
        lastName: null,
        about: null,
        location: null,
      },
    };

    this.handleFormFieldUpdate = this.handleFormFieldUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.fetchData(`${API_BASE_URL}/rtg/users/${AuthService.getUserId()}/`, ProfileForm.userToStateMapper);
    await this.fetchData(`${API_BASE_URL}/rtg/profiles/${AuthService.getUserId()}/`, ProfileForm.profileToStateMapper);

    this.setState({ loading: false });
  }

  async fetchData(url, responseToStateMapper) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? responseToStateMapper(response.json)
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  handleSubmit(e) {
    this.setState({ saving: true });
    setTimeout(() => this.setState({ saving: false }), 2000);
    e.preventDefault();
  }

  handleFormFieldUpdate(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  render() {
    return (
      <form className="ProfileForm__container" onSubmit={this.handleSubmit}>
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
            username={this.state.username}

            aboutError={this.state.formFieldErrors.about}
            dailyEmailsError={this.state.formFieldErrors.dailyEmails}
            emailError={this.state.formFieldErrors.email}
            email2Error={this.state.formFieldErrors.email2}
            firstNameError={this.state.formFieldErrors.firstName}
            lastNameError={this.state.formFieldErrors.lastName}
            locationError={this.state.formFieldErrors.location}
            reminderEmailsError={this.state.formFieldErrors.reminderEmails}
            usernameError={this.state.formFieldErrors.username}

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
