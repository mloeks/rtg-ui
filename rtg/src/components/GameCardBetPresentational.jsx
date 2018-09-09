import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import GameCardRibbon from './GameCardRibbon';
import { RESULT_SEPARATOR, VALID_GOAL_INPUT_REGEX } from '../service/ResultStringHelper';

import './GameCardBet.css';

// TODO P3 add arrow key functionality for in-/decreasing the goals while in an input field
const GoalInput = ({ id, goals, onChange, onBlur }) => {
  let textInputRef;

  const validateAndNotifyChange = (e, val) => {
    if (val.length === 0 || VALID_GOAL_INPUT_REGEX.test(val)) {
      onChange(e, val);
    }
  };

  return (
    <TextField
      ref={(input) => { textInputRef = input; }}
      className="GoalInput__text-field"
      id={id}
      value={goals}
      underlineShow={false}
      onBlur={onBlur}
      onChange={validateAndNotifyChange}
      onFocus={() => { textInputRef.select(); }}
      style={{ height: '100%', width: '40%' }}
      inputStyle={{
        color: '#F2CE00',
        fontFamily: '"Oswald", sans-serif',
        fontSize: '26px',
        textAlign: 'center',
      }}
    />);
};

GoalInput.propTypes = {
  id: PropTypes.string.isRequired,
  goals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};


const ARROW_SIZE = 26;
const GoalChangeArrow = (props) => {
  const arrowStyle = {
    height: `${ARROW_SIZE}px`,
    width: `${ARROW_SIZE}px`,
    color: 'white',
    opacity: 0.8,
  };
  return (props.direction === 'up' ?
    <KeyboardArrowUpIcon className="GameCardBet__arrow" style={arrowStyle} onClick={props.onClick} /> :
    <KeyboardArrowDownIcon
      className="GameCardBet__arrow"
      style={arrowStyle}
      onClick={props.onClick}
    />);
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
