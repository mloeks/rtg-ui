import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import GameCardRibbon from './GameCardRibbon';
import { RESULT_SEPARATOR, VALID_GOAL_INPUT_REGEX } from '../service/ResultStringHelper';

import './GameCardBet.css';

const styles = {
  goalInput: {
    color: '#F2CE00',
    fontFamily: '"Oswald", sans-serif',
    fontSize: 26,
    textAlign: 'center',
  },
};

// TODO P3 add arrow key functionality for in-/decreasing the goals while in an input field
const GoalInput = ({
  classes, id, goals, onChange, onBlur,
}) => {
  let textInputRef = React.createRef(); // eslint-disable-line prefer-const

  const validateAndNotifyChange = (val) => {
    if (val.length === 0 || VALID_GOAL_INPUT_REGEX.test(val)) {
      onChange(val);
    }
  };

  return (
    <TextField
      className="GoalInput__text-field"
      classes={{}}
      id={id}
      inputRef={textInputRef}
      value={goals}
      onBlur={onBlur}
      onChange={e => validateAndNotifyChange(e.target.value)}
      onFocus={() => {
        if (textInputRef && textInputRef.current) textInputRef.current.select();
      }}
      style={{ height: '100%', width: '40%' }}
      InputProps={{
        disableUnderline: true,
        classes: { input: classes.goalInput },
      }}
    />);
};

GoalInput.propTypes = {
  id: PropTypes.string.isRequired,
  goals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};


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
  id, homegoals, awaygoals, classes, onBlur, onHomegoalsChange, onAwaygoalsChange,
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
          classes={classes}
        />
        <span>{RESULT_SEPARATOR}</span>
        <GoalInput
          className="GoalInput GoalInput__away"
          id={`${id}-away`}
          goals={awaygoals}
          type="away"
          onChange={onAwaygoalsChange}
          onBlur={onBlur}
          classes={classes}
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

  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(GameCardBetPresentational);
