import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect, Route } from 'react-router-dom';
import AuthService from '../../service/AuthService';

// TODO P3 sometimes I landed in an infinite loop between / and /foyer
// when restarting the backend? Could not reproduce...
const AuthRoute = ({ component: Component, exact, path }) => (
  <Route
    exact={exact}
    path={path}
    render={(props) => {
      if (!AuthService.isAuthenticated()) {
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }

      AuthService.refreshTokenIfNecessary();
      return <Component />;
    }}
  />
);

AuthRoute.defaultProps = {
  exact: false,
};

AuthRoute.propTypes = {
  component: ReactRouterPropTypes.component.isRequired,
  exact: ReactRouterPropTypes.exact,
  path: ReactRouterPropTypes.path.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default AuthRoute;
