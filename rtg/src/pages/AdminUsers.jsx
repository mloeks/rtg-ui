import React from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import UsersGrid from '../components/admin/UsersGrid';

import headingImg from '../theme/img/headings/my/british_garden.webp';

const AdminUsers = () => (
  <Page className="AdminUsersPage">
    <BigPicture img={headingImg} positionY="60">
      <h2 className="BigPicture__heading">Benutzerverwaltung</h2>
    </BigPicture>
    <section className="AdminUsersPage__content">
      <UsersGrid />
    </section>
  </Page>
);

export default AdminUsers;
