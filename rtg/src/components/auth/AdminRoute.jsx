import React from 'react';
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
};

AdminRoute.propTypes = {
  component: ReactRouterPropTypes.component.isRequired,
  exact: ReactRouterPropTypes.exact,
  path: ReactRouterPropTypes.path.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default AdminRoute;
