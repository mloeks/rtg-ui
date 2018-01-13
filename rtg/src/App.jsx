import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route, Switch } from 'react-router-dom';
import Admin from './pages/Admin';
import Bets from './pages/Bets';
import Foyer from './pages/Foyer';
import Reception from './pages/Reception';
import PermissionDenied from './pages/403';
import AuthRoute from './components/auth/AuthRoute';
import AdminRoute from './components/auth/AdminRoute';

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
      <MuiThemeProvider>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Foyer} />
            <Route exact path="/403" component={PermissionDenied} />

            <AuthRoute exact path="/bets" component={Bets} />
            <AuthRoute exact path="/reception" component={Reception} />

            <AdminRoute exact path="/admin" component={Admin} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
