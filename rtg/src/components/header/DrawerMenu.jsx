import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import TodayIcon from '@material-ui/icons/Today';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import ProfileCard from './ProfileCard';
import AuthService from '../../service/AuthService';

import payPalLogo from '../../theme/img/paypal/de-pp-logo-100px.png';
import './DrawerMenu.css';

// TODO P3 the width is only once calculated on page load, not on re-open
const drawerStyles = theme => ({
  badge: {
    margin: '2px -14px 0',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
  paper: {
    width: window.matchMedia('(min-width: 480px)').matches ? 400 : '80%',
  },
});

const DrawerMenu = ({
  classes, onLogout, onClose, open, openBetsCount,
}) => {
  const openBetsBadge = (title, count) => (
    count > 0
      ? <Badge badgeContent={count} classes={{ badge: classes.badge }}>{title}</Badge>
      : title
  );

  return (
    <Drawer
      className="DrawerMenu"
      classes={{ paper: classes.paper }}
      open={open}
      onClose={onClose}
    >
      <Link to="/profile">
        <ProfileCard username={AuthService.getUsername()} avatar={AuthService.getAvatar()} />
      </Link>
      <Divider />

      {!AuthService.getHasPaid()
        && (
          <div className="DrawerMenu__payment-hint">
            <span>Bitte 5€ Tippeinsatz bezahlen</span>
            <a
              className="DrawerMenu__paypal-link"
              href="https://paypal.me/rtg2018/5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={payPalLogo}
                alt="PayPal link"
                style={{ width: '100px' }}
              />
            </a>
            <p className="DrawerMenu__bank-account">oder: DE64 5001 0517 5413 9735 33</p>
          </div>)}
      {!AuthService.getHasPaid() && <Divider />}

      <List>
        <Link to="/foyer">
          <ListItem button>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Foyer" />
          </ListItem>
        </Link>
        <Link to="/schedule">
          <ListItem button>
            <ListItemIcon><TodayIcon /></ListItemIcon>
          <ListItemText primary="Spielplan" />
          </ListItem>
        </Link>
        <Link to="/standings">
          <ListItem button>
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary="Spielstand" />
          </ListItem>
        </Link>
        <Link to="/bets">
          <ListItem button>
            <ListItemIcon><TrendingUpIcon /></ListItemIcon>
            <ListItemText primary={openBetsBadge('Tipps', openBetsCount)}/>
          </ListItem>
        </Link>
      </List>

      <Divider />

      <List>
        {AuthService.isAdmin()
          && (
            <Link to="/admin/users">
              <ListItem button>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Benutzerverwaltung" />
              </ListItem>
            </Link>
          )}

        <ListItem button onClick={onLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Ausloggen" />
        </ListItem>
      </List>
    </Drawer>);
};

DrawerMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  openBetsCount: PropTypes.number.isRequired,
  onLogout: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(drawerStyles)(DrawerMenu);
