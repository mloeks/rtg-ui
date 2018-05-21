import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardMedia, CardTitle, Checkbox, IconButton } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { API_BASE_URL } from '../../service/AuthService';
import { grey } from '../../theme/RtgTheme';

const CARD_SIZE = 230;

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
      <Card style={{ width: CARD_SIZE, textAlign: 'left', marginBottom: '20px' }}>
        <CardMedia
          overlay={
            <CardTitle
              title={this.props.username}
              titleStyle={{
                fontFamily: '"Lobster Two", sans-serif',
                fontSize: '20px',
                lineHeight: '24px',
              }}
            />
          }
          style={{ height: 0.8 * CARD_SIZE, overflow: 'hidden' }}
        >
          <img src={`${API_BASE_URL}/media/${this.props.avatar}`} alt="User avatar" />
        </CardMedia>
        <CardTitle
          title={`${this.props.first_name} ${this.props.last_name}`}
          subtitle="Letzter Login: N/A"
          titleStyle={{ fontSize: '20px' }}
        />
        <CardActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Checkbox
            label="Bezahlt?"
            checked={this.props.has_paid}
            onCheck={(e, v) => this.props.onHasPaidUpdated(this.props.pk, v)}
          />
          <IconButton onClick={this.handleDeleteRequest}><ActionDelete color={grey} /></IconButton>
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
