import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import UsersGrid from '../components/admin/UsersGrid';

import headingImg from '../theme/img/headings/zarenfamilie.jpg';

// TODO P2 add some possibilities for Admins
// e.g. user has paid, remove user, enter game result, add new game...
const AdminUsers = () => (
  <Page className="AdminUsersPage">
    <BigPicture img={headingImg}>
      <h1 className="BigPicture__heading">Benutzerverwaltung</h1>
    </BigPicture>
    <section className="AdminUsersPage__content">
      <UsersGrid />
    </section>
  </Page>
);

export default AdminUsers;
