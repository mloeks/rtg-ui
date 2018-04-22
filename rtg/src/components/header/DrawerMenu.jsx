import React from 'react';
import { PropTypes } from 'prop-types';
import { Badge, Divider, Drawer, MenuItem } from 'material-ui';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Home from 'material-ui/svg-icons/action/home';
import List from 'material-ui/svg-icons/action/list';
import Today from 'material-ui/svg-icons/action/today';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import { Link } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import AuthService from '../../service/AuthService';

import './DrawerMenu.css';

const DrawerMenu = (props) => {
  const openBetsBadge = (title, count) => {
    if (count > 0) {
      return (
        <Badge
          badgeContent={count}
          secondary
          style={{ padding: '0' }}
          badgeStyle={{ top: '3px', right: '-25px' }}
        >{title}
        </Badge>);
    }
    return title;
  };

  return (
    <Drawer
      className="DrawerMenu"
      docked={false}
      open={props.open}
      onRequestChange={props.onRequestChange}
    >
      <Link to="/profile">
        <ProfileCard username={AuthService.getUsername()} avatar={AuthService.getAvatar()} />
      </Link>

      <Divider />

      <Link to="/foyer">
        <MenuItem primaryText="Neuigkeiten" leftIcon={<Home />} />
      </Link>
      <Link to="/schedule">
        <MenuItem primaryText="Spielplan" leftIcon={<Today />} />
      </Link>
      <Link to="/standings">
        <MenuItem primaryText="Spielstand" leftIcon={<List />} />
      </Link>
      <Link to="/bets">
        <MenuItem
          primaryText={openBetsBadge('Tipps', props.openBetsCount)}
          leftIcon={<TrendingUp />}
        />
      </Link>

      <Divider />

      {AuthService.isAdmin() &&
        <Link to="/admin">
          <MenuItem primaryText="Administration" leftIcon={<ActionSettings />} />
        </Link>}

      <MenuItem primaryText="Ausloggen" leftIcon={<ActionExitToApp />} onClick={props.onLogout} />
    </Drawer>);
};

DrawerMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  openBetsCount: PropTypes.number.isRequired,
  onLogout: PropTypes.func.isRequired,
  onRequestChange: PropTypes.func.isRequired,
};

export default DrawerMenu;
