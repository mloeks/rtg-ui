import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import OpenBetsIndicator from './OpenBetsIndicator';

import './HeaderMenuItems.css';

const HeaderMenuItems = props => (
  <div className="HeaderMenuItems">
    <Link to="/standings" title="Spielstand">
      <Button
        className="HeaderMenuItems__item"
        color="primary"
        icon={<ListIcon />}
        style={{ minWidth: '20px' }}
      >Spielstand</Button>
    </Link>

    <Link to="/bets" title="Tipps abgeben">
      <Button
        className="HeaderMenuItems__item"
        color="primary"
        icon={<TrendingUpIcon />}
        style={{ minWidth: '20px' }}
      >Tipps</Button>
    </Link>
    <OpenBetsIndicator number={props.openBetsCount} />
  </div>
);

HeaderMenuItems.propTypes = {
  openBetsCount: PropTypes.number.isRequired,
};

export default HeaderMenuItems;
