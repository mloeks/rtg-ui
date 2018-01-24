import React, { Component } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import AppBar from 'material-ui/AppBar';
import { Link, withRouter } from 'react-router-dom';
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
          <AppBar
            className="Header__AppBar"
            title="Royale Tippgemeinschaft 2018"
            showMenuIconButton={false}
            onTitleClick={() => { this.props.history.push('/'); }}
          />
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
          onTitleClick={() => { this.props.history.push('/'); }}
        />
        <Drawer
          className="Header__menu"
          docked={false}
          open={this.state.menuOpen}
          onRequestChange={menuOpen => this.setState({ menuOpen })}
        >
          <Link to="/foyer"><MenuItem primaryText="Neuigkeiten" /></Link>
          <Link to="/schedule"><MenuItem primaryText="Spielplan" /></Link>
          <Link to="/standings"><MenuItem primaryText="Spielstand" /></Link>
          <Link to="/bets"><MenuItem primaryText="Tipps" /></Link>
        </Drawer>
      </header>);
  }
}

Header.propTypes = {
  // eslint-disable-next-line react/no-typos
  history: ReactRouterProptypes.history.isRequired,
};

export default withRouter(Header);
