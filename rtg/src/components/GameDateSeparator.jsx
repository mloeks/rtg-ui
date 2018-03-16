import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import de from 'date-fns/locale/de';

import './GameDateSeparator.css';

const GameDateSeparator = props => (
  <div className="GameDateSeparator">
    <div className="GameDateSeparator__text">
      {format(props.date, 'dddd D. MMMM', { locale: de })}
    </div>
  </div>
);

GameDateSeparator.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export default GameDateSeparator;
