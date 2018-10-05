import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import TodayIcon from '@material-ui/icons/Today';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Link } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import AuthService from '../../service/AuthService';
import { error, white } from '../../theme/RtgTheme';

import payPalLogo from '../../theme/img/paypal/de-pp-logo-100px.png';
import './DrawerMenu.css';

// TODO P3 the width is only once calculated on page load, not on re-open
const drawerStyles = {
  paper: {
    width: window.matchMedia('(min-width: 480px)').matches ? 400 : '80%',
  },
};

const DrawerMenu = ({
  classes, onLogout, onClose, open, openBetsCount,
}) => {
  const openBetsBadge = (title, count) => {
    if (count > 0) {
      return (
        <Badge
          badgeContent={count}
          style={{ padding: '0' }}
          badgeStyle={{
            backgroundColor: error,
            color: white,
            top: '3px',
            right: '-25px',
          }}
        >
          {title}
        </Badge>);
    }
    return title;
  };

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

      <Link to="/foyer">
        <MenuItem primaryText="Foyer" leftIcon={<HomeIcon />} />
      </Link>
      <Link to="/schedule">
        <MenuItem primaryText="Spielplan" leftIcon={<TodayIcon />} />
      </Link>
      <Link to="/standings">
        <MenuItem primaryText="Spielstand" leftIcon={<ListIcon />} />
      </Link>
      <Link to="/bets">
        <MenuItem
          primaryText={openBetsBadge('Tipps', openBetsCount)}
          leftIcon={<TrendingUpIcon />}
        />
      </Link>

      <Divider />

      {AuthService.isAdmin()
        && (
          <Link to="/admin/users">
            <MenuItem primaryText="Benutzerverwaltung" leftIcon={<SettingsIcon />} />
          </Link>
        )}

      <MenuItem primaryText="Ausloggen" leftIcon={<ExitToAppIcon />} onClick={onLogout} />
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
