import React, { Component } from 'react';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import UserCard from './UserCard';
import Notification, { NotificationType } from '../Notification';
import { CircularProgress } from 'material-ui';
import UsersGridToolbar from './UsersGridToolbar';
import { grey } from '../../theme/RtgTheme';

class UsersGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],

      searchTerm: '',
      filterActive: true,
      filterHasNotPaid: false,

      loading: true,
      loadingError: false,
    };

    this.handleHasPaidUpdated = this.handleHasPaidUpdated.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearchTermUpdated = this.handleSearchTermUpdated.bind(this);
  }

  componentDidMount() {
    fetch(`${API_BASE_URL}/rtg/users_admin/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? { loading: false, users: response.json }
            : { loading: false, loadingError: true }
        ));
      }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  handleHasPaidUpdated(userId, hasPaid) {
    this.setState((prevState) => {
      const updatedUsers = prevState.users.slice(0);
      const updatedUserIndex = updatedUsers.findIndex(u => u.pk === userId);
      updatedUsers[updatedUserIndex].has_paid = hasPaid;
      return { users: updatedUsers };
    });
  }

  handleDelete(userId) {
    this.setState((prevState) => {
      const updatedUsers = prevState.users.slice(0);
      const updatedUserIndex = updatedUsers.findIndex(u => u.pk === userId);
      updatedUsers.splice(updatedUserIndex, 1);
      return { users: updatedUsers };
    });
  }

  handleSearchTermUpdated(searchTerm) {
    this.setState({ searchTerm });
  }

  render() {
    let filteredUsers = this.state.users;
    if (this.state.filterActive) {
      filteredUsers = filteredUsers.filter(user => user.last_login !== null);
    }
    if (this.state.filterHasNotPaid) {
      filteredUsers = filteredUsers.filter(user => !user.has_paid);
    }
    if (this.state.searchTerm) {
      filteredUsers = filteredUsers.filter(user => (
        `${user.username} ${user.first_name} ${user.last_name}`.toLowerCase()
          .indexOf(this.state.searchTerm.toLowerCase()) !== -1));
    }

    return (
      <section style={{ margin: '20px auto', maxWidth: 1024 }}>
        <UsersGridToolbar
          searchTerm={this.state.searchTerm}
          filterActive={this.state.filterActive}
          filterHasNotPaid={this.state.filterHasNotPaid}

          onFilterActiveToggled={() =>
            this.setState((prevState) => ({ filterActive: !prevState.filterActive }))}
          onFilterHasNotPaidToggled={() =>
            this.setState((prevState) => ({ filterHasNotPaid: !prevState.filterHasNotPaid }))}
          onSearchTermUpdated={this.handleSearchTermUpdated}
        />

        {this.state.loading && <CircularProgress />}
        {this.state.loadingError &&
        <Notification
          type={NotificationType.ERROR}
          title="Fehler beim Laden"
          subtitle="Bitte versuche es erneut."
          style={{ margin: '20px auto', maxWidth: '640px' }}
        />}

        {(!this.state.loading && !this.state.loadingError) &&
          <div style={{ margin: '20px 0', fontSize: '14px', color: grey }}>
            {filteredUsers.length === 0 ? 'Keine' : filteredUsers.length} User gefunden.
          </div>}

        <div
          className="UsersGrid__grid"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            margin: '0 auto',
            padding: '0 10px',
          }}
        >
          {filteredUsers.map(user => (
            <UserCard
              key={`user-card-${user.pk}`}
              onHasPaidUpdated={this.handleHasPaidUpdated}
              onDelete={this.handleDelete}
              {...user}
            />))}
        </div>
      </section>
    );
  }
}

UsersGrid.propTypes = {};

export default UsersGrid;
