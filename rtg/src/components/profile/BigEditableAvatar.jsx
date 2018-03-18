import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';
import { teal400 } from 'material-ui/styles/colors';
import Person from 'material-ui/svg-icons/social/person';

import './BigEditableAvatar.css';

// TODO P1 enable avatar upload
class BigEditableAvatar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="BigEditableAvatar">
        <Avatar
          className="BigEditableAvatar__avatar"
          backgroundColor={!this.props.avatarUrl ? teal400 : null}
          icon={!this.props.avatarUrl ? <Person /> : null}
          src={this.props.avatarUrl}
          size={150}
        /> :
        <h2 className="BigEditableAvatar__username">{this.props.username}</h2>
      </div>
    );
  }
}

BigEditableAvatar.defaultProps = {
  avatarUrl: null,
};

BigEditableAvatar.propTypes = {
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
};

export default BigEditableAvatar;
