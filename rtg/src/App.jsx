import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Route, Switch } from 'react-router-dom';

import Rules from './pages/Rules';
import Contact from './pages/Contact';
import About from './pages/About';
import Imprint from './pages/Imprint';
import Donate from './pages/Donate';

import Admin from './pages/Admin';
import Bets from './pages/Bets';
import Foyer from './pages/Foyer';
import Reception from './pages/Reception';
import PermissionDenied from './pages/403';


import AuthRoute from './components/auth/AuthRoute';
import AdminRoute from './components/auth/AdminRoute';

import rtg from './theme/RtgTheme';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: 'foo',
    };
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(rtg)}>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Reception} />
            <Route exact path="/403" component={PermissionDenied} />

            {/* Static, public pages */}
            <Route exact path="/rules" component={Rules} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/about" component={About} />
            <Route exact path="/imprint" component={Imprint} />
            <Route exact path="/donate" component={Donate} />

            {/* Login Area */}
            <AuthRoute exact path="/bets" component={Bets} />
            <AuthRoute exact path="/foyer" component={Foyer} />

            <AdminRoute exact path="/admin" component={Admin} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
