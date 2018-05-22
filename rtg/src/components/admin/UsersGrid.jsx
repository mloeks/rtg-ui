import React, { Component } from 'react';
import AuthService, { API_BASE_URL } from "../../service/AuthService";
import FetchHelper from "../../service/FetchHelper";
import UserCard from "./UserCard";

class UsersGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],

      loading: true,
      loadingError: false,
    };

    this.handleHasPaidUpdated = this.handleHasPaidUpdated.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  render() {
    return (
      <section
        className="UsersGrid"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '20px auto',
          padding: '10px',
          maxWidth: 1024,
        }}
      >
        {this.state.users.map(user => (
          <UserCard
            key={`user-card-${user.pk}`}
            onHasPaidUpdated={this.handleHasPaidUpdated}
            onDelete={this.handleDelete}
            {...user}
          />))}
      </section>
    );
  }
}

UsersGrid.propTypes = {};

export default UsersGrid;
