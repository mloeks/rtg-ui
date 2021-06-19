import React from 'react';
import PropTypes from 'prop-types';

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import GameCardRibbon from './GameCardRibbon';
import GoalInput from './bets/GoalInput';
import { NO_GOALS_STRING, RESULT_SEPARATOR } from '../service/ResultStringHelper';

import './GameCardScoreEditor.scss';

const ARROW_SIZE = 26;
const GoalChangeArrow = ({ direction, onClick }) => {
  const arrowStyle = {
    height: ARROW_SIZE,
    width: ARROW_SIZE,
    color: 'white',
    opacity: 0.8,
  };
  return (direction === 'up'
    ? <KeyboardArrowUpIcon className="GameCardScoreEditor__arrow" style={arrowStyle} onClick={onClick} />
    : <KeyboardArrowDownIcon className="GameCardScoreEditor__arrow" style={arrowStyle} onClick={onClick} />);
};

GoalChangeArrow.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired,
  onClick: PropTypes.func.isRequired,
};

const GameCardScoreEditorPresentational = ({
  id, homegoals, awaygoals, onBlur, onHomegoalsChange, onAwaygoalsChange,
  onHomegoalsIncrementalChange, onAwaygoalsIncrementalChange,
}) => (
  <GameCardRibbon stateCssClass="score">
    <div className="GameCardScoreEditor">
      <div className="GameCardScoreEditor__up-arrow-row">
        <GoalChangeArrow direction="up" onClick={() => onHomegoalsIncrementalChange(1)} />
        <GoalChangeArrow direction="up" onClick={() => onAwaygoalsIncrementalChange(1)} />
      </div>
      <div className="GameCardScoreEditor__goal-input-row">
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
      <div className="GameCardScoreEditor__down-arrow-row">
        <GoalChangeArrow direction="down" onClick={() => onHomegoalsIncrementalChange(-1)} />
        <GoalChangeArrow direction="down" onClick={() => onAwaygoalsIncrementalChange(-1)} />
      </div>
    </div>
  </GameCardRibbon>
);

GameCardScoreEditorPresentational.defaultProps = {
  homegoals: NO_GOALS_STRING,
  awaygoals: NO_GOALS_STRING,
};

GameCardScoreEditorPresentational.propTypes = {
  id: PropTypes.number.isRequired,
  homegoals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  awaygoals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  onBlur: PropTypes.func.isRequired,
  onHomegoalsChange: PropTypes.func.isRequired,
  onAwaygoalsChange: PropTypes.func.isRequired,
  onHomegoalsIncrementalChange: PropTypes.func.isRequired,
  onAwaygoalsIncrementalChange: PropTypes.func.isRequired,
};

export default GameCardScoreEditorPresentational;
