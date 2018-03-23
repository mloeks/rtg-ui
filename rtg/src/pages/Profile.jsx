import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import ProfileForm from '../components/profile/ProfileForm';
import BigEditableAvatar from '../components/profile/BigEditableAvatar';
import AuthService from '../service/AuthService';

import headingImg from '../theme/img/img8.jpg';

// TODO P1 handle avatar in the state of this component and pass it down to
// BigEditableAvatar and ProfileForm as prop. Have it updated by BigEditableAvatar callback.

const Profile = () => (
  <Page className="ProfilePage">
    <BigPicture className="ProfilePage__heading" img={headingImg} />
    <section className="ProfilePage__content">
      <BigEditableAvatar userId={AuthService.getUserId()} username={AuthService.getUsername()} />
      <ProfileForm />
    </section>
  </Page>
);

export default Profile;
