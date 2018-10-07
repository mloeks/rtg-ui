import React, { Component, Fragment } from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import ProfileForm from '../components/profile/ProfileForm';
import BigEditableAvatar from '../components/profile/BigEditableAvatar';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import { LogoutReason, UserDetailsContext } from '../components/providers/UserDetailsProvider';
import RtgSeparator from '../components/RtgSeparator';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import DeleteAccountButton from '../components/profile/DeleteAccountButton';

import headingImg from '../theme/img/headings/bed.jpg';

// TODO P3 offer possibility to delete avatar
class Profile extends Component {
  static userMapper(userJson) {
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

  static handleAvatarChanged(newAvatar, userContext) {
    userContext.updateAvatar(newAvatar);
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loadingError: false,

      userId: AuthService.getUserId(),
      user: null,
    };
  }

  componentDidMount() {
    fetch(`${API_BASE_URL}/rtg/users/${AuthService.getUserId()}/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => ({
          loading: false,
          ...(response.ok ? { user: Profile.userMapper(response.json) }
            : { loadingError: true }
          ),
        }));
      }).catch(() => this.setState({ loadingError: true, loading: false }));
  }

  render() {
    const {
      loading,
      loadingError,
      user,
      userId,
    } = this.state;

    return (
      <Page className="ProfilePage">
        <BigPicture className="ProfilePage__heading" img={headingImg} positionY={75} />
        <section className="ProfilePage__content" style={{ position: 'relative', padding: '10px' }}>

          {user && (
            <UserDetailsContext.Consumer>
              {userContext => (
                <Fragment>
                  <BigEditableAvatar
                    userId={userId}
                    username={user.username || ''}
                    avatarUrl={user.avatar || ''}

                    loading={loading}
                    loadingError={loadingError}

                    onAvatarChanged={avatar => Profile.handleAvatarChanged(avatar, userContext)}
                  />

                  <ProfileForm
                    userId={userId}
                    user={user}
                    loading={loading}
                    loadingError={loadingError}
                  />

                  <RtgSeparator style={{ maxWidth: '500px' }} />
                  <ChangePasswordForm />

                  <RtgSeparator style={{ maxWidth: '500px' }} />
                  <DeleteAccountButton
                    userId={userId}
                    onDelete={() => userContext.doLogout(LogoutReason.ACCOUNT_DELETED)}
                  />
                </Fragment>
              )}
            </UserDetailsContext.Consumer>
          )}
        </section>
      </Page>
    );
  }
}

export default Profile;
