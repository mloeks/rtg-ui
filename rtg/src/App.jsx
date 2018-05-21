import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Route, Switch } from 'react-router-dom';

import Rules from './pages/Rules';
import Contact from './pages/Contact';
import About from './pages/About';
import Imprint from './pages/Imprint';
import Donate from './pages/Donate';

import Reception from './pages/Reception';
import Foyer from './pages/Foyer';
import Bets from './pages/Bets';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import Profile from './pages/Profile';

import AdminUsers from './pages/AdminUsers';
import PermissionDenied from './pages/403';
import PasswordReset from './pages/PasswordReset';

import AuthRoute from './components/auth/AuthRoute';
import AdminRoute from './components/auth/AdminRoute';

import rtg from './theme/RtgTheme';
import './App.css';

// TODO P3 Implement bottom navigation for mobile breakpoints
const App = () => {
  const isDemo = window.location.href.match(/.*demo.*/i);
  const isLocal = window.location.href.match(/.*(localhost|192.168.).*/i);

  return (
    <MuiThemeProvider muiTheme={getMuiTheme(rtg)}>
      <div className="App">
        {(isDemo || isLocal) &&
          <div className="App__demo-indicator">{isDemo ? 'DEMO' : 'LOCAL'}</div>}

        <Switch>
          <Route exact path="/" component={Reception} />
          <Route exact path="/403" component={PermissionDenied} />

          {/* Static, public pages */}
          <Route exact path="/rules" component={Rules} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/about" component={About} />
          <Route exact path="/imprint" component={Imprint} />
          <Route exact path="/donate" component={Donate} />

          {/* Password reset - protected by token in URL */}
          <Route exact path="/passwordreset/:uid/:token" component={PasswordReset} />

          {/* Login Area */}
          <AuthRoute exact path="/foyer" component={Foyer} />
          <AuthRoute exact path="/bets" component={Bets} />
          <AuthRoute exact path="/schedule" component={Schedule} />
          <AuthRoute exact path="/standings" component={Standings} />
          <AuthRoute exact path="/profile" component={Profile} />

          <AdminRoute exact path="/admin/users" component={AdminUsers} />
        </Switch>
      </div>
    </MuiThemeProvider>
  );
};

export default App;
