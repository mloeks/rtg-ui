import React, { Component, Fragment } from 'react';
import ReactRouterProptypes from 'react-router-prop-types';
import { scrollY } from 'verge';
import AppBar from 'material-ui/AppBar';
import { withRouter } from 'react-router-dom';
import { UserDetailsContext } from '../providers/UserDetailsProvider';
import DrawerMenu from './DrawerMenu';
import HeaderMenuItems from './HeaderMenuItems';
import { debounce, ThrottledScrollPositionListener } from '../../service/EventsHelper';

import './Header.css';

const HEADER_HEIGHT = 64;

// TODO P3 implement fancy trapecoid header design that I once planned
class Header extends Component {
  constructor(props) {
    super(props);
    const initialYPos = scrollY();

    this.state = {
      menuOpen: false,
      scrollingUp: initialYPos === 0, // initial down scroll should detect a "scrolling down" change
      headerTop: initialYPos === 0 ? 0 : -HEADER_HEIGHT,
    };

    this.headerRef = React.createRef();
    this.scrollHandler = null;

    this.onScroll = this.onScroll.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }

  componentDidMount() {
    this.scrollHandler = new ThrottledScrollPositionListener();
    this.scrollHandler.addCallback(debounce(this.onScroll, 150));
  }

  componentWillUnmount() {
    if (this.scrollHandler) {
      this.scrollHandler.removeAll();
    }
  }

  // TODO P1 does not work correctly yet with page reloads where scrollY > 0
  onScroll(position, increment) {
    this.setState((prevState) => {
      if (!prevState.scrollingUp && increment < 0) {
        return { scrollingUp: true, headerTop: 0 };
      }
      if (prevState.scrollingUp && increment > 0) {
        if (scrollY() < HEADER_HEIGHT) {
          return null;
        }
        return { scrollingUp: false, headerTop: -HEADER_HEIGHT };
      }
      return null;
    });
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
      />
    );

    return (
      <UserDetailsContext.Consumer>
        {(userContext) => {
          const loggedIn = userContext.isAuthenticated;
          return (
            <Fragment>
              <div className="Header__fixed-placeholder" style={{ height: HEADER_HEIGHT }} />
              <header
                ref={this.headerRef}
                className="Header"
                style={{ top: this.state.headerTop }}
              >
                {createAppBarVariant(userContext, loggedIn, 'RTG', 'Header__AppBar--mobile')}
                {createAppBarVariant(userContext, loggedIn, 'Royale Tippgemeinschaft', 'Header__AppBar--desktop')}
                {loggedIn && <DrawerMenu
                  open={this.state.menuOpen}
                  openBetsCount={userContext.openBetsCount}
                  onLogout={userContext.doLogout}
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
