import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import AuthService from '../../service/AuthService';

// TODO P3 sometimes I landed in an inifinite loop between / and /foyer
// when restarting the backend? Could not reproduce...
const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!AuthService.isAuthenticated()) {
          // eslint-disable-next-line react/prop-types
          return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
        }

        AuthService.refreshTokenIfNecessary();
        return <Component {...props} />;
      }}
    />);
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func, PropTypes.element,
  ]).isRequired,
};

export default AuthRoute;
