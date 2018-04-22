import React, { Component } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import AppBar from 'material-ui/AppBar';
import { withRouter } from 'react-router-dom';
import { UserDetailsContext } from '../providers/UserDetailsProvider';
import DrawerMenu from './DrawerMenu';

import './Header.css';

// TODO P1 Show Open Bets in header if there are > 0
// TODO P1 Pimp Drawer menu --> Add google-like avatar & profile to the top
// TODO P2 make it appear sticky on up-scroll?
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
              {loggedIn && <DrawerMenu
                open={this.state.menuOpen}
                onLogout={userContext.doLogout}
                onRequestChange={menuOpen => this.setState({ menuOpen })}
              />}
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
