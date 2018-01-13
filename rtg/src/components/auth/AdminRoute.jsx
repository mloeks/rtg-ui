import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import authService from '../../service/AuthService';

const AuthRoute = ({ component: Component, ...rest }) => {
  const componentToRender = (props) => {
    if (authService.isAuthenticated) {
      if (authService.isAdmin) {
        return <Component {...props} />;
      } else {
        return <Redirect to={{pathname: '/403', state: {from: props.location}}}/>;
      }
    } else {
      return <Redirect to={{pathname: '/', state: {from: props.location}}}/>;
    }
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
