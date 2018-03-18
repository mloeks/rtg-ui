import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'material-ui';
import Person from 'material-ui/svg-icons/social/person';

import './BigEditableAvatar.css';

// TODO handle
class BigEditableAvatar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const avatar = this.props.avatarUrl ?
      <Avatar className="ProfilePage__avatar" src={this.props.avatarUrl} size={128} /> :
      <Avatar className="ProfilePage__avatar--no-pic" icon={<Person />} size={128} />;

    return (
      <div className="BigEditableAvatar">
        {avatar}
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
