import React from 'react';
import PropTypes from 'prop-types';

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import GameCardRibbon from './GameCardRibbon';
import GoalInput from './bets/GoalInput';
import { RESULT_SEPARATOR } from '../service/ResultStringHelper';

import './GameCardBet.css';

const ARROW_SIZE = 26;
const GoalChangeArrow = ({ direction, onClick }) => {
  const arrowStyle = {
    height: ARROW_SIZE,
    width: ARROW_SIZE,
    color: 'white',
    opacity: 0.8,
  };
  return (direction === 'up'
    ? <KeyboardArrowUpIcon className="GameCardBet__arrow" style={arrowStyle} onClick={onClick} />
    : <KeyboardArrowDownIcon className="GameCardBet__arrow" style={arrowStyle} onClick={onClick} />);
};

GoalChangeArrow.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired,
  onClick: PropTypes.func.isRequired,
};

const GameCardBetPresentational = ({
  id, homegoals, awaygoals, onBlur, onHomegoalsChange, onAwaygoalsChange,
  onHomegoalsIncrementalChange, onAwaygoalsIncrementalChange,
}) => (
  <GameCardRibbon stateCssClass="bet">
    <div className="GameCardBet">
      <div className="GameCardBet__up-arrow-row">
        <GoalChangeArrow direction="up" onClick={() => onHomegoalsIncrementalChange(1)} />
        <GoalChangeArrow direction="up" onClick={() => onAwaygoalsIncrementalChange(1)} />
      </div>
      <div className="GameCardBet__goal-input-row">
        <GoalInput
          className="GoalInput GoalInput__home"
          id={`${id}-home`}
          goals={homegoals}
          type="home"
          onChange={onHomegoalsChange}
          onBlur={onBlur}
        />
        <span>{RESULT_SEPARATOR}</span>
        <GoalInput
          className="GoalInput GoalInput__away"
          id={`${id}-away`}
          goals={awaygoals}
          type="away"
          onChange={onAwaygoalsChange}
          onBlur={onBlur}
        />
      </div>
      <div className="GameCardBet__down-arrow-row">
        <GoalChangeArrow direction="down" onClick={() => onHomegoalsIncrementalChange(-1)} />
        <GoalChangeArrow direction="down" onClick={() => onAwaygoalsIncrementalChange(-1)} />
      </div>
    </div>
  </GameCardRibbon>
);

GameCardBetPresentational.propTypes = {
  id: PropTypes.number.isRequired,
  homegoals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  awaygoals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  onBlur: PropTypes.func.isRequired,
  onHomegoalsChange: PropTypes.func.isRequired,
  onAwaygoalsChange: PropTypes.func.isRequired,
  onHomegoalsIncrementalChange: PropTypes.func.isRequired,
  onAwaygoalsIncrementalChange: PropTypes.func.isRequired,
};

export default GameCardBetPresentational;
