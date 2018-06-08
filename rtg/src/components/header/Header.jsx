import React, { Component, Fragment } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import { scrollY } from 'verge';
import AppBar from 'material-ui/AppBar';
import { withRouter } from 'react-router-dom';
import { UserDetailsContext } from '../providers/UserDetailsProvider';
import DrawerMenu from './DrawerMenu';
import HeaderMenuItems from './HeaderMenuItems';
import { throttle, ThrottledScrollPositionListener } from '../../service/EventsHelper';

import './Header.css';

const HEADER_HEIGHT = 64; // sync with $headerHeight in _globals.scss

// TODO P3 implement fancy trapecoid header design that I once planned
class Header extends Component {
  // make sure sticky headers on other pages are offset by HEADER_HEIGHT if the header is visible
  static offsetStickyHeaders(setOffsetClass) {
    const otherStickyHeaderClassNames = [
      'SchedulePage__toolbar', 'UsersGridToolbar', 'BetsPage__tabs',
    ];
    otherStickyHeaderClassNames.forEach((cls) => {
      const el = document.querySelector(`.${cls}`);
      if (el) {
        if (setOffsetClass) {
          el.classList.add('header-offset');
          el.style.top = `${HEADER_HEIGHT}px`;
        } else {
          el.classList.remove('header-offset');
          el.style.top = 0;
        }
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = { menuOpen: false };

    this.headerRef = React.createRef();
    this.scrollHandler = null;
    this.lastKnownYPos = scrollY();

    this.handleHeaderVisibility = this.handleHeaderVisibility.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }

  componentDidMount() {
    this.scrollHandler = new ThrottledScrollPositionListener();
    this.scrollHandler.addCallback(throttle(this.handleHeaderVisibility, 100));
  }

  componentWillUnmount() {
    if (this.scrollHandler) {
      this.scrollHandler.removeAll();
    }
  }

  // Adopted from https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c
  // solved without state updates in order to be more performant and avoid render the entire
  // children tree.
  handleHeaderVisibility(position) {
    const delta = position - this.lastKnownYPos;
    const headerEl = this.headerRef.current;

    if (headerEl) {
      if (delta > 0 && position > HEADER_HEIGHT) {
        // If current position > last position AND scrolled past navbar...
        // Scroll Down
        headerEl.classList.remove('nav-down');
        headerEl.classList.add('nav-up');
        Header.offsetStickyHeaders(false);
      } else if (position + window.innerHeight < document.body.scrollHeight) {
        // If did not scroll past the document (possible on mac)...
        // Scroll Up
        headerEl.classList.remove('nav-up');
        headerEl.classList.add('nav-down');
        Header.offsetStickyHeaders(true);
      }
    }
    this.lastKnownYPos = position;
  }

  handleMenuToggle() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    const createAppBarVariant = (userContext, loggedIn, title, className) => (
      <AppBar
        className={`Header__AppBar ${className}`}
        title={title}
        showMenuIconButton={loggedIn}
        iconElementRight={loggedIn ?
          <HeaderMenuItems openBetsCount={userContext.openBetsCount} /> : null}
        iconStyleRight={{ display: 'flex', alignItems: 'center', margin: 0 }}
        onLeftIconButtonClick={this.handleMenuToggle}
        onTitleClick={() => { this.props.history.push('/'); }}
        style={{ height: HEADER_HEIGHT }}
        titleStyle={{ textAlign: loggedIn ? 'left' : 'center', flexGrow: 1 }}
      />
    );

    return (
      <UserDetailsContext.Consumer>
        {(userContext) => {
          const loggedIn = userContext.isAuthenticated;
          return (
            <Fragment>
              <div className="Header__fixed-placeholder" style={{ height: HEADER_HEIGHT }} />
              <header ref={this.headerRef} className="Header">
                {createAppBarVariant(userContext, loggedIn, 'RTG', 'Header__AppBar--mobile')}
                {createAppBarVariant(userContext, loggedIn, 'Royale Tippgemeinschaft', 'Header__AppBar--desktop')}
                {loggedIn && <DrawerMenu
                  open={this.state.menuOpen}
                  openBetsCount={userContext.openBetsCount}
                  onLogout={() => userContext.doLogout()}
                  onRequestChange={menuOpen => this.setState({ menuOpen })}
                />}
              </header>
            </Fragment>);
        }}
      </UserDetailsContext.Consumer>);
  }
}

Header.propTypes = {
  // eslint-disable-next-line react/no-typos
  history: ReactRouterProptypes.history.isRequired,
};

export default withRouter(Header);
