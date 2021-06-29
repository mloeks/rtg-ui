import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import UserCard from './UserCard';
import Notification, { NotificationType } from '../Notification';
import UsersGridToolbar from './UsersGridToolbar';

class UsersGrid extends Component {
  static isUserActive(lastLogin) {
    return (lastLogin !== null && new Date(lastLogin).getFullYear() === new Date().getFullYear());
  }

  constructor(props) {
    super(props);
    this.state = {
      users: [],

      searchTerm: '',
      filterActive: true,
      filterInactive: false,
      filterHasNotPaid: false,
      sortBy: 'username',

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
      const updatedUserIndex = updatedUsers.findIndex((u) => u.pk === userId);
      updatedUsers[updatedUserIndex].has_paid = hasPaid;
      return { users: updatedUsers };
    });
  }

  handleDelete(userId) {
    this.setState((prevState) => {
      const updatedUsers = prevState.users.slice(0);
      const updatedUserIndex = updatedUsers.findIndex((u) => u.pk === userId);
      updatedUsers.splice(updatedUserIndex, 1);
      return { users: updatedUsers };
    });
  }

  handleSearchTermUpdated(searchTerm) {
    this.setState({ searchTerm });
  }

  render() {
    const {
      filterActive,
      filterHasNotPaid,
      filterInactive,
      loading,
      loadingError,
      searchTerm,
      sortBy,
      users,
    } = this.state;
    const { theme } = this.props;

    let filteredUsers = users;
    if (filterActive) {
      filteredUsers = filteredUsers.filter((user) => UsersGrid.isUserActive(user.last_login));
    }
    if (filterInactive) {
      filteredUsers = filteredUsers.filter((user) => !UsersGrid.isUserActive(user.last_login));
    }
    if (filterHasNotPaid) {
      filteredUsers = filteredUsers.filter((user) => !user.has_paid);
    }
    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user) => (
        `${user.username} ${user.first_name} ${user.last_name}`.toLowerCase()
          .indexOf(searchTerm.toLowerCase()) !== -1));
    }
    if (sortBy === 'username') {
      filteredUsers = filteredUsers
        .sort((a, b) => a.username.toLowerCase() > b.username.toLowerCase());
    }
    if (sortBy === 'openBets') {
      filteredUsers = filteredUsers.sort((a, b) => a.open_bettables < b.open_bettables);
    }

    return (
      <section style={{ margin: '20px auto', maxWidth: 1024 }}>
        <UsersGridToolbar
          searchTerm={searchTerm}
          filterActive={filterActive}
          filterInactive={filterInactive}
          filterHasNotPaid={filterHasNotPaid}
          sortBy={sortBy}
          onFilterActiveToggled={() => this
            .setState((prevState) => ({ filterActive: !prevState.filterActive }))}
          onFilterInactiveToggled={() => this
            .setState((prevState) => ({ filterInactive: !prevState.filterInactive }))}
          onFilterHasNotPaidToggled={() => this
            .setState((prevState) => ({ filterHasNotPaid: !prevState.filterHasNotPaid }))}
          onSearchTermUpdated={this.handleSearchTermUpdated}
          onSortByChanged={(e) => this.setState({ sortBy: e.target.value })}
        />

        {loading && <CircularProgress />}
        {loadingError && (
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden"
            subtitle="Bitte versuche es erneut."
            containerStyle={{ margin: '20px auto', maxWidth: '640px' }}
          />
        )}

        {(!loading && !loadingError) && (
          <div
            style={{
              margin: '20px 0',
              fontSize: '14px',
              color: theme.palette.grey['500'],
            }}
          >
            {filteredUsers.length === 0 ? 'Keine' : filteredUsers.length}
            &nbsp;User gefunden.
          </div>
        )}

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
          {filteredUsers.map((user) => (
            <UserCard
              pk={user.pk}
              username={user.username}
              email={user.email}
              email2={user.email2}
              firstName={user.first_name}
              lastName={user.last_name}
              active={UsersGrid.isUserActive(user.last_login)}
              avatar={user.avatar}
              hasPaid={user.has_paid}
              key={`user-card-${user.pk}`}
              lastLogin={user.last_login ? new Date(user.last_login) : null}
              openBettables={user.open_bettables}
              onHasPaidUpdated={this.handleHasPaidUpdated}
              onDelete={this.handleDelete}
            />
          ))}
        </div>
      </section>
    );
  }
}

UsersGrid.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(UsersGrid);
