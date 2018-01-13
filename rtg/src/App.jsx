import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route, Switch } from 'react-router-dom';
import Admin from './pages/Admin';
import Bets from './pages/Bets';
import Foyer from './pages/Foyer';
import Reception from './pages/Reception';
import AuthRoute from './components/auth/AuthRoute';

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

            <AuthRoute exact path="/bets" component={Bets} />
            <AuthRoute exact path="/reception" component={Reception} />} />

            <Route exact path="/admin" component={Admin} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
