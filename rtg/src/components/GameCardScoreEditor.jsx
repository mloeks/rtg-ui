import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getAwaygoals,
  getGoalsString,
  getHomegoals,
  MAX_GOALS_INPUT,
  NO_GOALS_STRING,
  toResultString,
} from '../service/ResultStringHelper';
import GameCardScoreEditorPresentational from './GameCardScoreEditorPresentational';

class GameCardScoreEditor extends Component {
  static getIncrementedGoal(previousValue, inc) {
    const previousValueNumber = Number(previousValue);
    if (typeof previousValue === 'undefined' || Number.isNaN(previousValue)
        || (previousValue === NO_GOALS_STRING && inc === 1)) {
      return 0;
    }
    if (previousValue === NO_GOALS_STRING && inc === -1) {
      return previousValue;
    }
    if (previousValueNumber === MAX_GOALS_INPUT && inc === 1) {
      return previousValueNumber;
    }
    if (previousValueNumber === 0 && inc === -1) {
      return NO_GOALS_STRING;
    }

    return previousValueNumber + inc;
  }

  constructor(props) {
    super(props);
    const { scoreValue } = this.props;

    this.state = {
      homegoals: scoreValue ? getHomegoals(scoreValue) : undefined,
      awaygoals: scoreValue ? getAwaygoals(scoreValue) : undefined,
    };

    this.handleHomegoalsChange = this.handleHomegoalsChange.bind(this);
    this.handleAwaygoalsChange = this.handleAwaygoalsChange.bind(this);
    this.handleHomegoalsIncrementalChange = this.handleHomegoalsIncrementalChange.bind(this);
    this.handleAwaygoalsIncrementalChange = this.handleAwaygoalsIncrementalChange.bind(this);
    this.notifyChange = this.notifyChange.bind(this);
    this.sanitizeScore = this.sanitizeScore.bind(this);
  }

  handleHomegoalsChange(value) {
    this.setState({ homegoals: value }, this.notifyChange());
  }

  handleAwaygoalsChange(value) {
    this.setState({ awaygoals: value }, this.notifyChange());
  }

  handleHomegoalsIncrementalChange(inc) {
    this.setState((prevState) => ({
      homegoals: GameCardScoreEditor.getIncrementedGoal(prevState.homegoals, inc),
    }), this.notifyChange);
  }

  handleAwaygoalsIncrementalChange(inc) {
    this.setState((prevState) => ({
      awaygoals: GameCardScoreEditor.getIncrementedGoal(prevState.awaygoals, inc),
    }), this.notifyChange);
  }

  notifyChange() {
    const { homegoals, awaygoals } = this.state;
    const { onChange } = this.props;
    onChange(toResultString(homegoals, awaygoals));
  }

  sanitizeScore() {
    this.setState((prevState) => ({
      homegoals: getGoalsString(prevState.homegoals),
      awaygoals: getGoalsString(prevState.awaygoals),
    }), this.notifyChange);
  }

  render() {
    const { homegoals, awaygoals } = this.state;
    const { gameId } = this.props;

    return (
      <GameCardScoreEditorPresentational
        id={gameId}
        homegoals={homegoals}
        awaygoals={awaygoals}
        onBlur={this.sanitizeScore}
        onHomegoalsChange={(val) => this.handleHomegoalsChange(val)}
        onAwaygoalsChange={(val) => this.handleAwaygoalsChange(val)}
        onHomegoalsIncrementalChange={(inc) => this.handleHomegoalsIncrementalChange(inc)}
        onAwaygoalsIncrementalChange={(inc) => this.handleAwaygoalsIncrementalChange(inc)}
      />
    );
  }
}

GameCardScoreEditor.defaultProps = {
  scoreValue: null,
};

GameCardScoreEditor.propTypes = {
  gameId: PropTypes.number.isRequired,
  scoreValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default GameCardScoreEditor;
