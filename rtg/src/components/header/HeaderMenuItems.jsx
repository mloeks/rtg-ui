import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import OpenBetsIndicator from './OpenBetsIndicator';

import './HeaderMenuItems.css';

const HeaderMenuItems = ({ openBetsCount }) => (
  <div className="HeaderMenuItems" style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
    <Link to="/standings" title="Spielstand">
      <Button variant="flat" color="primary" style={{ minWidth: 0, padding: 8 }}>
        <ListIcon />
        <span className="HeaderMenuItems__item-label">Spielstand</span>
      </Button>
    </Link>

    <Link to="/bets" title="Tipps abgeben">
      <Button variant="flat" color="primary" style={{ minWidth: 0, padding: 8 }}>
        <TrendingUpIcon />
        <span className="HeaderMenuItems__item-label">Tipps</span>
      </Button>
    </Link>
    <OpenBetsIndicator number={openBetsCount} />
  </div>
);

HeaderMenuItems.propTypes = {
  openBetsCount: PropTypes.number.isRequired,
};

export default HeaderMenuItems;
