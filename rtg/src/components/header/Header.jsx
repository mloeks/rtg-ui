import React, { Component } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import AppBar from 'material-ui/AppBar';
import { Link, withRouter } from 'react-router-dom';
import { Drawer, MenuItem } from 'material-ui';
import Home from 'material-ui/svg-icons/action/home';
import List from 'material-ui/svg-icons/action/list';
import Today from 'material-ui/svg-icons/action/today';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import UserMenu from '../UserMenu';
import { API_BASE_URL } from '../../service/AuthService';
import { UserDetailsContext } from '../providers/UserDetailsProvider';

import './Header.css';

// TODO P1 Show Open Bets in header if there are > 0
// TODO P2 make it appear sticky on up-scroll?
// TODO P2 Display little down arrow beneath user avatar
// TODO P2 Pimp Drawer menu --> Add logo to the top
// TODO P3 Display open bets as badge on the "Tipps abgeben" Drawer menu entry
// TODO P3 implement fancy trapecoid header design that I once planned
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: false };
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }

  handleMenuToggle() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    const createAppBarVariant = (userContext, loggedIn, title, className) => (
      <AppBar
        className={`Header__AppBar ${className}`}
        title={title}
        titleStyle={{ textAlign: 'left' }}
        showMenuIconButton={loggedIn}
        iconElementRight={loggedIn ?
          <UserMenu
            avatar={userContext.avatar ? `${API_BASE_URL}/media/${userContext.avatar}` : null}
            username={userContext.username}
            onLogout={userContext.doLogout}
          /> : null}
        onLeftIconButtonClick={this.handleMenuToggle}
        onTitleClick={() => { this.props.history.push('/'); }}
      />
    );

    return (
      <UserDetailsContext.Consumer>
        {(userContext) => {
          const loggedIn = userContext.isAuthenticated;
          return (
            <header className="Header">
              {createAppBarVariant(userContext, loggedIn, 'RTG', 'Header__AppBar--mobile')}
              {createAppBarVariant(userContext, loggedIn, 'Royale Tippgemeinschaft', 'Header__AppBar--desktop')}

              {loggedIn &&
                <Drawer
                  className="Header__menu"
                  docked={false}
                  open={this.state.menuOpen}
                  onRequestChange={menuOpen => this.setState({ menuOpen })}
                >
                  <Link to="/foyer">
                    <MenuItem primaryText="Neuigkeiten" leftIcon={<Home />} />
                  </Link>
                  <Link to="/schedule">
                    <MenuItem primaryText="Spielplan" leftIcon={<Today />} />
                  </Link>
                  <Link to="/standings">
                    <MenuItem primaryText="Spielstand" leftIcon={<List />} />
                  </Link>
                  <Link to="/bets"><MenuItem primaryText="Tipps" leftIcon={<TrendingUp />} /></Link>
                </Drawer>}
            </header>);
        }}
      </UserDetailsContext.Consumer>);
  }
}

Header.propTypes = {
  // eslint-disable-next-line react/no-typos
  history: ReactRouterProptypes.history.isRequired,
};

export default withRouter(Header);
