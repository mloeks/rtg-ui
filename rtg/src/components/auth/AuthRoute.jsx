import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import AuthService from '../../service/AuthService';

const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        AuthService.isAuthenticated() === true
          ? <Component {...props} />
          // eslint-disable-next-line react/prop-types
          : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )}
    />);
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func, PropTypes.element,
  ]).isRequired,
};

export default AuthRoute;
