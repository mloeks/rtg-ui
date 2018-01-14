import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterProptypes from 'react-router-prop-types';
import { Link, withRouter } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Avatar, Divider, IconMenu, MenuItem } from 'material-ui';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import AuthService from '../service/AuthService';

import './UserMenu.css';

const UserMenu = (props) => {
  const userAndAvatar = (
    <div className="UserMenu">
      <div className="UserMenu__username">{props.username}</div>
      <Avatar
        className="UserMenu__avatar"
        color={props.muiTheme.appBar.avatarColor}
        backgroundColor={props.muiTheme.appBar.avatarBackgroundColor}
      >{props.username[0].toUpperCase()}
      </Avatar>
    </div>
  );

  return (
    <IconMenu
      iconButtonElement={userAndAvatar}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Link to="/profile"><MenuItem primaryText="Profil" /></Link>

      {AuthService.isAdmin() && <Divider />}
      {AuthService.isAdmin() &&
      <Link to="/admin">
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

UserMenu.propTypes = {
  // eslint-disable-next-line react/no-typos
  history: ReactRouterProptypes.history.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
};

export default muiThemeable()(withRouter(UserMenu));
