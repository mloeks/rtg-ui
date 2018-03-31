import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import GameCardRibbon from './GameCardRibbon';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import { getGoalsString, NO_GOALS_STRING, RESULT_SEPARATOR } from '../service/ResultStringHelper';

import './GameCardBet.css';
import './GoalInput.css';

const validGoalInputRegex = /^([0-9]|10)$/;

// TODO P1  handle all kinds of save, propagate to parent when a bet could not be saved
// TODO P3 add arrow key functionality for in-/decreasing the goals while in an input field
const GoalInput = ({ id, goals, type, onChange, onBlur }) => {
  let textInputRef;

  const validateAndNotifyChange = (e, val) => {
    if (val.length === 0 || validGoalInputRegex.test(val)) {
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
      style={{ height: '100%' }}
      inputStyle={{
        color: '#F2CE00',
        fontFamily: '"Oswald", sans-serif',
        fontSize: '26px',
        textAlign: 'center',
      }}
    />);
};

GoalInput.defaultProps = {
  goals: '',
};

GoalInput.propTypes = {
  id: PropTypes.string.isRequired,
  goals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};


const ARROW_SIZE = 16;
const GoalChangeArrow = (props) => {
  const arrowStyle = {
    height: `${ARROW_SIZE}px`,
    width: `${ARROW_SIZE}px`,
    padding: '0 5px',
    color: 'white',
  };
  return (props.direction === 'up' ?
    <KeyboardArrowUp style={arrowStyle} onClick={props.onClick} /> :
    <KeyboardArrowDown style={arrowStyle} onClick={props.onClick} />);
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

class GameCardBet extends Component {
  static getIncrementedGoal(previousValue, inc) {
    const previousValueNumber = Number(previousValue);
    if (Number.isNaN(previousValue) || (previousValue === NO_GOALS_STRING && inc === 1)) {
      return 0;
    } else if (previousValue === NO_GOALS_STRING && inc === -1) {
      return previousValue;
    } else if (previousValueNumber === 10 && inc === 1) {
      return previousValueNumber;
    } else if (previousValueNumber === 0 && inc === -1) {
      return NO_GOALS_STRING;
    }
    return previousValueNumber + inc;
  }

  constructor(props) {
    super(props);

    this.state = {
      userBet: null,

      homegoalsInput: NO_GOALS_STRING,
      awaygoalsInput: NO_GOALS_STRING,

      isSaving: false,
      savingError: false,
      loadingError: false,
    };

    this.handleHomegoalsChange = this.handleHomegoalsChange.bind(this);
    this.handleAwaygoalsChange = this.handleAwaygoalsChange.bind(this);
    this.handleHomegoalsIncrementalChange = this.handleHomegoalsIncrementalChange.bind(this);
    this.handleAwaygoalsIncrementalChange = this.handleAwaygoalsIncrementalChange.bind(this);
    this.sanitizeBet = this.sanitizeBet.bind(this);
  }

  componentDidMount() {
    this.fetchUserBet();
  }

  fetchUserBet() {
    return fetch(`${API_BASE_URL}/rtg/bets/?bettable=${this.props.gameId}`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ?
            { bet: response.json.length > 0 ? response.json[0] : null }
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  // TODO P1 save when required from parent component (via prop & receiveprops),
  // require and invoke success and error callbacks
  // in the parent, remember bets with saving issues
  // also stay able to save a single bet from here, might be needed for other usages
  // of GameBetCard!
  // TODO P3 DRY with ExtraBetCard, introduce BetSavingHelper
  handleSave() {
    if (this.state.userBet && !this.state.isSaving) {
      this.setState({ isSaving: true, savingSuccess: false, savingError: false });

      const newBet = this.state.userBet;
      const body = newBet !== null ? { bettable: this.props.gameId, result_bet: newBet } : null;

      let method;
      let url = `${API_BASE_URL}/rtg/bets/`;
      if (this.state.userBet.id) {
        url += `${this.state.userBet.id}/`;
        method = newBet !== null ? 'PUT' : 'DELETE';
      } else {
        method = 'POST';
      }

      fetch(url, {
        headers: {
          Authorization: `Token ${AuthService.getToken()}`,
          'content-type': 'application/json',
        },
        method,
        body: JSON.stringify(body),
      }).then(FetchHelper.parseJson)
        .then((response) => {
          if (response.ok) {
            this.setState({
              savingSuccess: true,
              isSaving: false,
              hasChanges: false,
              userBet: response.json || null,
            }, () => {
              if (method === 'POST') {
                this.props.onBetAdded();
              } else if (method === 'DELETE') {
                this.props.onBetRemoved();
              }
            });
          } else {
            this.setState({ savingError: true, isSaving: false });
          }
        }).catch(() => this.setState({ savingError: true, isSaving: false }));
    }
  }

  handleHomegoalsChange(e, value) { this.setState({ homegoalsInput: value }); }
  handleAwaygoalsChange(e, value) { this.setState({ awaygoalsInput: value }); }

  handleHomegoalsIncrementalChange(inc) {
    this.setState(prevState => (
      { homegoalsInput: GameCardBet.getIncrementedGoal(prevState.homegoalsInput, inc) }
    ));
  }

  handleAwaygoalsIncrementalChange(inc) {
    this.setState(prevState => (
      { awaygoalsInput: GameCardBet.getIncrementedGoal(prevState.awaygoalsInput, inc) }
    ));
  }

  sanitizeBet() {
    this.setState(prevState => ({
      homegoalsInput: getGoalsString(prevState.homegoalsInput),
      awaygoalsInput: getGoalsString(prevState.awaygoalsInput),
    }));
  }

  render() {
    return (
      <GameCardBetPresentational
        id={this.props.gameId}
        homegoals={this.state.homegoalsInput}
        awaygoals={this.state.awaygoalsInput}

        onBlur={this.sanitizeBet}
        onHomegoalsChange={this.handleHomegoalsChange}
        onAwaygoalsChange={this.handleAwaygoalsChange}
        onHomegoalsIncrementalChange={this.handleHomegoalsIncrementalChange}
        onAwaygoalsIncrementalChange={this.handleAwaygoalsIncrementalChange}
      />
    );
  }
}

GameCardBet.propTypes = {
  gameId: PropTypes.number.isRequired,

  onBetAdded: PropTypes.func.isRequired,
  onBetRemoved: PropTypes.func.isRequired,
};

export default GameCardBet;
