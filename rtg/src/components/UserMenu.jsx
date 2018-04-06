import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterProptypes from 'react-router-prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Divider, FlatButton, IconMenu, MenuItem } from 'material-ui';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import SocialPerson from 'material-ui/svg-icons/social/person';
import AuthService from '../service/AuthService';
import UserAvatar from './UserAvatar';

// TODO P2 within the IconMenu, the UserAvatar is constantly re-rendered
// Instead, do not put it into a FlatButton but make my own div
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
        onClick={() => AuthService.logout().then(() => props.history.push('/'))}
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

  // eslint-disable-next-line react/no-typos
  history: ReactRouterProptypes.history.isRequired,
};

export default withRouter(UserMenu);
