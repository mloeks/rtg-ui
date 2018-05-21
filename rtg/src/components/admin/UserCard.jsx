import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardMedia, CardTitle, Checkbox, FlatButton } from 'material-ui';
import { API_BASE_URL } from '../../service/AuthService';

class UserCard extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
  }

  handleDeleteRequest() {
    // TODO show confirmation
    this.props.onDelete(this.props.pk);
  }

  render() {
    return (
      <Card style={{ width: '200px' }}>
        <CardMedia
          overlay={<CardTitle title={this.props.username} />}
          style={{ height: '200px' }}
        >
          <img src={`${API_BASE_URL}/media/${this.props.avatar}`} alt="User avatar" />
        </CardMedia>
        <CardTitle title={`${this.props.first_name} ${this.props.last_name}`} />
        <CardActions>
          <Checkbox
            label="Einsatz bezahlt?"
            checked={this.props.has_paid}
            onCheck={(e, v) => this.props.onHasPaidUpdated(this.props.pk, v)}
          /><br />
          <FlatButton label="Löschen" onClick={this.handleDeleteRequest} />
        </CardActions>
      </Card>
    );
  }
}

UserCard.defaultProps = {
  avatar: null,
};

UserCard.propTypes = {
  pk: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  has_paid: PropTypes.bool.isRequired,

  onHasPaidUpdated: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserCard;
