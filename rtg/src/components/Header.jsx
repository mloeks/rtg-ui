import React, { Component } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import AppBar from 'material-ui/AppBar';
import { Link, withRouter } from 'react-router-dom';
import { Divider, Drawer, MenuItem } from 'material-ui';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import authService from '../service/AuthService';

import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
    };

    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }

  handleMenuToggle() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    return (
      <header className="Header">
        <AppBar
          title="Royale Tippgemeinschaft - 2018"
          onLeftIconButtonClick={this.handleMenuToggle}
        />
        <Drawer
          className="Header__menu"
          docked={false}
          open={this.state.menuOpen}
          onRequestChange={(menuOpen) => this.setState({ menuOpen })}
        >
          <Link to="/reception"><MenuItem primaryText="Rezeption" /></Link>
          <Link to="/bets"><MenuItem primaryText="Tipps" /></Link>

          {authService.isAdmin && <Divider />}
          {authService.isAdmin &&
          <Link to="/admin">
            <MenuItem
              primaryText="Admin"
              rightIcon={<ActionSettings />}
            />
          </Link>}

          {authService.isAuthenticated && <Divider />}
          {authService.isAuthenticated && <MenuItem
            primaryText="Log Out"
            rightIcon={<ActionExitToApp />}
            onClick={() => authService.logout().then(() => this.props.history.push('/'))}
          />}
        </Drawer>
      </header>);
  }
}

Header.propTypes = {
  // eslint-disable-next-line react/no-typos
  history: ReactRouterProptypes.history.isRequired,
};

export default withRouter(Header);
