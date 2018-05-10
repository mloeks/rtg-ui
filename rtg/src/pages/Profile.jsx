import React, { Component } from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import ProfileForm from '../components/profile/ProfileForm';
import BigEditableAvatar from '../components/profile/BigEditableAvatar';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import { UserDetailsContext } from '../components/providers/UserDetailsProvider';

import headingImg from '../theme/img/headings/bed.jpg';

// TODO P1 offer possibility to change password
// TODO P1 offer possibility to change email
// TODO P2 offer possibility to delete account
// TODO P3 offer possibility to delete avatar
class Profile extends Component {
  static userToStateMapper(userJson) {
    return {
      userId: userJson.pk,
      username: userJson.username,
      firstName: userJson.first_name,
      lastName: userJson.last_name,
      email: userJson.email,
      email2: userJson.email2 || '',
      location: userJson.location || '',
      about: userJson.about || '',
      avatar: userJson.avatar,
      reminderEmails: userJson.reminder_emails,
      dailyEmails: userJson.daily_emails,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loadingError: false,

      userId: AuthService.getUserId(),
      username: AuthService.getUsername(),
      email: AuthService.getEmail(),
      email2: '',
      firstName: '',
      lastName: '',
      about: '',
      location: '',
      avatar: AuthService.getAvatar(),

      dailyEmails: true,
      reminderEmails: true,
    };

    this.handleFormFieldUpdate = this.handleFormFieldUpdate.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
    this.handleAvatarChanged = this.handleAvatarChanged.bind(this);
  }

  componentDidMount() {
    fetch(`${API_BASE_URL}/rtg/users/${AuthService.getUserId()}/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => ({
          loading: false,
          ...(response.ok ? Profile.userToStateMapper(response.json)
            : { loadingError: true }
          ),
        }));
      }).catch(() => this.setState({ loadingError: true, loading: false }));
  }

  handleFormFieldUpdate(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  handleUserUpdate(newUser) {
    this.setState(Profile.userToStateMapper(newUser));
  }

  handleAvatarChanged(newAvatar, userContext) {
    this.setState({ avatar: newAvatar }, () => {
      userContext.updateAvatar(newAvatar);
    });
  }

  render() {
    return (
      <Page className="ProfilePage">
        <BigPicture className="ProfilePage__heading" img={headingImg} positionY={75} />
        <section className="ProfilePage__content" style={{ position: 'relative' }}>

          <UserDetailsContext.Consumer>
            {userContext => (
              <BigEditableAvatar
                userId={this.state.userId}
                username={this.state.username}
                avatarUrl={this.state.avatar && `${API_BASE_URL}/media/${this.state.avatar}`}

                loading={this.state.loading}
                loadingError={this.state.loadingError}

                onAvatarChanged={avatar => this.handleAvatarChanged(avatar, userContext)}
              />
            )}
          </UserDetailsContext.Consumer>

          <ProfileForm
            userId={this.state.userId}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            email={this.state.email}
            email2={this.state.email2}
            about={this.state.about}
            location={this.state.location}

            reminderEmails={this.state.reminderEmails}
            dailyEmails={this.state.dailyEmails}

            loading={this.state.loading}
            loadingError={this.state.loadingError}

            onFieldChange={this.handleFormFieldUpdate}
            onUserUpdate={this.handleUserUpdate}
          />
        </section>
      </Page>
    );
  }
}

export default Profile;
