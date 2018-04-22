import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import AuthService from '../../service/AuthService';

const AuthRoute = ({ component: Component, ...rest }) => {
  const componentToRender = (props) => {
    if (!AuthService.isAuthenticated()) {
      // eslint-disable-next-line react/prop-types
      return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
    }

    if (!AuthService.isAdmin()) {
      // eslint-disable-next-line react/prop-types
      return <Redirect to={{ pathname: '/403', state: { from: props.location } }} />;
    }

    AuthService.refreshTokenIfNecessary();
    return <Component {...props} />;
  };

  return (
    <Route {...rest} render={componentToRender} />);
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func, PropTypes.element,
  ]).isRequired,
};

export default AuthRoute;
