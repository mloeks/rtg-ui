import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Divider, FlatButton, IconMenu, MenuItem } from 'material-ui';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import SocialPerson from 'material-ui/svg-icons/social/person';
import AuthService from '../service/AuthService';
import UserAvatar from './UserAvatar';

const UserMenu = (props) => {
  const userAndAvatar = (
    <FlatButton
      className="UserMenu"
      label={props.username}
      labelPosition="before"
      icon={
        <UserAvatar
          size={35}
          username={props.username}
          img={props.avatar}
        />
      }
      style={{ height: '50px' }}
    />
  );

  const linkStyle = { textDecoration: 'none' };

  return (
    <IconMenu
      iconButtonElement={userAndAvatar}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      menuStyle={{ textAlign: 'left' }}
    >
      <Link to="/profile" style={linkStyle}>
        <MenuItem
          primaryText="Profil"
          rightIcon={<SocialPerson />}
        />
      </Link>

      {AuthService.isAdmin() && <Divider />}
      {AuthService.isAdmin() &&
      <Link to="/admin" style={linkStyle}>
        <MenuItem
          primaryText="Admin"
          rightIcon={<ActionSettings />}
        />
      </Link>}

      <Divider />
      <MenuItem
        primaryText="Ausloggen"
        rightIcon={<ActionExitToApp />}
        onClick={props.onLogout}
      />
    </IconMenu>
  );
};

UserMenu.defaultProps = {
  avatar: null,
};

UserMenu.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserMenu;
