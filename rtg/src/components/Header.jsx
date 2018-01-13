import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Link, withRouter } from 'react-router-dom';
import { Divider, IconButton, IconMenu, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import authService from '../service/AuthService';

const Header = withRouter(({ history }) => (
  <AppBar
    title="Royale Tippgemeinschaft - 2018"
    iconElementRight={
      <IconMenu
        iconButtonElement={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      >
        <Link to="/reception"><MenuItem primaryText="Rezeption" /></Link>
        <Link to="/bets"><MenuItem primaryText="Tipps" /></Link>

        {authService.isAdmin && <Divider />}
        {authService.isAdmin &&
        <Link to="/admin">
          <MenuItem
            primaryText="Admin"
            leftIcon={<ActionSettings />}
          />
        </Link>}

        {authService.isAuthenticated && <Divider />}
        {authService.isAuthenticated && <MenuItem
          primaryText="Log Out"
          leftIcon={<ActionExitToApp />}
          onClick={() => authService.logout(() => history.push('/'))}
        />}
      </IconMenu>
    }
  />
));

export default Header;
