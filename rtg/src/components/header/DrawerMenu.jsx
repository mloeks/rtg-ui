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
import { error, white } from '../../theme/RtgTheme';

import payPalLogo from '../../theme/img/paypal/de-pp-logo-100px.png';
import './DrawerMenu.css';

const DrawerMenu = (props) => {
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
      swipeAreaWidth={75}
      width={window.matchMedia('(min-width: 480px)').matches ? 400 : '80%'}
      onRequestChange={props.onRequestChange}
    >
      <Link to="/profile">
        <ProfileCard username={AuthService.getUsername()} avatar={AuthService.getAvatar()} />
      </Link>

      <Divider />

      {!AuthService.getHasPaid() &&
        <div className="DrawerMenu__payment-hint">
          <span>Bitte 5€ Tippeinsatz bezahlen</span>
          <a
            className="DrawerMenu__paypal-link"
            href="https://paypal.me/rtg2018/5"
            target="_blank"
            rel="noopener noreferrer"
          ><img
            src={payPalLogo}
            alt="PayPal link"
            style={{ width: '100px' }}
          />
          </a>
          <p className="DrawerMenu__bank-account">oder: DE64 5001 0517 5413 9735 33</p>
        </div>}
      {!AuthService.getHasPaid() && <Divider />}

      <Link to="/foyer">
        <MenuItem primaryText="Foyer" leftIcon={<Home />} />
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
        <Link to="/admin/users">
          <MenuItem primaryText="Benutzerverwaltung" leftIcon={<ActionSettings />} />
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
