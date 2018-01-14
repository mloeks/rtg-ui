import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router-dom';
import { Drawer, MenuItem } from 'material-ui';
import UserMenu from './UserMenu';
import AuthService from '../service/AuthService';

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
    if (!AuthService.isAuthenticated()) {
      return (
        <header className="Header">
          <AppBar title="Royale Tippgemeinschaft 2018" showMenuIconButton={false} />
        </header>);
    }

    return (
      <header className="Header">
        <AppBar
          title="Royale Tippgemeinschaft 2018"
          iconElementRight={AuthService.isAuthenticated() &&
            <UserMenu username={AuthService.getUsername()} />
          }
          onLeftIconButtonClick={this.handleMenuToggle}
        />
        <Drawer
          className="Header__menu"
          docked={false}
          open={this.state.menuOpen}
          onRequestChange={(menuOpen) => this.setState({ menuOpen })}
        >
          <Link to="/foyer"><MenuItem primaryText="Neuigkeiten" /></Link>
          <Link to="/schedule"><MenuItem primaryText="Spielplan" /></Link>
          <Link to="/standings"><MenuItem primaryText="Spielstand" /></Link>
          <Link to="/bets"><MenuItem primaryText="Tipps" /></Link>
        </Drawer>
      </header>);
  }
}

export default Header;
