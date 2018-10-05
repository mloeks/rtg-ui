import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '../UserAvatar';

import profileBgImage from '../../theme/img/headings/french_windows.jpg';
import './ProfileCard.css';

const ProfileCard = ({ avatar, username }) => (
  <div
    className="ProfileCard"
    style={{ backgroundImage: `url(${profileBgImage})` }}
  >
    <UserAvatar
      size={75}
      img={avatar}
      username={username}
      style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0 0 3px, rgba(0, 0, 0, 0.15) 2px 3px 5px' }}
    />
    <div className="ProfileCard__content">
      <div className="ProfileCard__username">{username}</div>
      <div className="ProfileCard__subtitle">Hier klicken für persönliche Einstellungen</div>
    </div>
  </div>

);

ProfileCard.defaultProps = {
  avatar: null,
};

ProfileCard.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string.isRequired,
};

export default ProfileCard;
