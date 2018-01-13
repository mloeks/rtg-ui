import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router-dom';
import { Divider, IconButton, IconMenu, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionSettings from 'material-ui/svg-icons/action/settings';

const Header = () => (
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
        <Link to="/"><MenuItem primaryText="Foyer" /></Link>
        <Link to="/bets"><MenuItem primaryText="Tipps" /></Link>
        <Divider />
        <Link to="/admin">
          <MenuItem
            primaryText="Admin"
            leftIcon={<ActionSettings />}
          />
        </Link>
      </IconMenu>
    }
  />
);

export default Header;