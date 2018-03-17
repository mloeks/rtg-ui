import React from 'react';
import PropTypes from 'prop-types';

import './GameCardBet.css';
import GameCardRibbon from "./GameCardRibbon";

const GoalInput = ({ goals, onChange }) => (
  <div className="GameCardBet__goal-input GameCardBet__homegoals">
    {goals === -1 ? '-' : goals}
  </div>
);

GoalInput.defaultProps = {
  goals: -1,
  onChange: null,
};

GoalInput.propTypes = {
  goals: PropTypes.number,
  onChange: PropTypes.func,
};

const GameCardBet = (props) => {
  return (
    <GameCardRibbon stateCssClass="bet">
      <GoalInput goals={props.homegoals} />
      <span> : </span>
      <GoalInput goals={props.awaygoals} />
    </GameCardRibbon>
  );
};

GameCardBet.defaultProps = {
  homegoals: -1,
  awaygoals: -1,
};

GameCardBet.propTypes = {
  homegoals: PropTypes.number,
  awaygoals: PropTypes.number,
};

export default GameCardBet;
