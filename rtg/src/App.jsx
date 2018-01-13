import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Bets from './pages/Bets';
import Foyer from './pages/Foyer';

import './App.css';

const App = () => (
  <MuiThemeProvider>
    <div className="App">
      <Route exact path="/" component={Foyer} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/bets" component={Bets} />
    </div>
  </MuiThemeProvider>
);

export default App;
