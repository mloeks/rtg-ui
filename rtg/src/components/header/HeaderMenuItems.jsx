import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import List from 'material-ui/svg-icons/action/list';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import OpenBetsIndicator from './OpenBetsIndicator';

import './HeaderMenuItems.css';

const HeaderMenuItems = props => (
  <div className="HeaderMenuItems">
    <Link to="/standings" title="Spielstand">
      <FlatButton
        className="HeaderMenuItems__item"
        label="Spielstand"
        primary
        icon={<List />}
        style={{ minWidth: '20px' }}
      />
    </Link>

    <Link to="/bets" title="Tipps abgeben">
      <FlatButton
        className="HeaderMenuItems__item"
        label="Tipps"
        primary
        icon={<TrendingUp />}
        style={{ minWidth: '20px' }}
      />
    </Link>
    <OpenBetsIndicator number={props.openBetsCount} />
  </div>
);

HeaderMenuItems.propTypes = {
  openBetsCount: PropTypes.number.isRequired,
};

export default HeaderMenuItems;
