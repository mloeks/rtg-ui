import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect, Route } from 'react-router-dom';
import AuthService from '../../service/AuthService';

const AdminRoute = ({ component: Component, exact, path }) => {
  const componentToRender = (props) => {
    if (!AuthService.isAuthenticated()) {
      return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
    }

    if (!AuthService.isAdmin()) {
      return <Redirect to={{ pathname: '/403', state: { from: props.location } }} />;
    }

    AuthService.refreshTokenIfNecessary();
    return <Component exact={exact} path={path} />;
  };

  return (
    <Route exact={exact} path={path} render={componentToRender} />);
};

AdminRoute.defaultProps = {
  exact: false,
  location: null,
};

AdminRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func, PropTypes.element, PropTypes.node, PropTypes.object,
  ]).isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  location: ReactRouterPropTypes.location,
};

export default AdminRoute;
