import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import {
  getAwaygoals,
  getGoalsString,
  getHomegoals,
  isCompleteResult,
  isEmptyResult,
  MAX_GOALS_INPUT,
  NO_GOALS_STRING,
  toResultString,
} from '../service/ResultStringHelper';
import { BetsStatusContext } from '../pages/Bets';
import GameCardBetPresentational from './GameCardBetPresentational';

export const SavingSuccessType = {
  UNCHANGED: 'UNCHANGED',
  ADDED: 'ADDED',
  UPDATED: 'UPDATED',
  DELETED: 'DELETED',
};

export const SavingErrorType = {
  INCOMPLETE: 'INCOMPLETE',
  DEADLINE_PASSED: 'DEADLINE_PASSED',
  FAILED: 'FAILED',
};

// TODO P3 handle and display bet loading failure
class GameCardBet extends Component {
  static getIncrementedGoal(previousValue, inc) {
    const previousValueNumber = Number(previousValue);
    if (Number.isNaN(previousValue) || (previousValue === NO_GOALS_STRING && inc === 1)) {
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

  static goalsStateFromUserBet(userBet) {
    const resultAvailable = userBet && userBet.result_bet;
    return {
      homegoalsInput: resultAvailable ? getHomegoals(userBet.result_bet) : NO_GOALS_STRING,
      awaygoalsInput: resultAvailable ? getAwaygoals(userBet.result_bet) : NO_GOALS_STRING,
    };
  }

  static updateBetsHaveChanges(context) {
    if (context && !context.betsHaveChanges) {
      context.updateBetsHaveChanges(true);
    }
  }

  constructor(props) {
    super(props);

    const { userBet } = this.props;

    this.state = {
      userBet: userBet !== null ? Object.assign({}, userBet) : null,
      ...GameCardBet.goalsStateFromUserBet(userBet),
      hasChanges: false,
      isSaving: false,
    };

    this.save = this.save.bind(this);
    this.handleHomegoalsChange = this.handleHomegoalsChange.bind(this);
    this.handleAwaygoalsChange = this.handleAwaygoalsChange.bind(this);
    this.handleHomegoalsIncrementalChange = this.handleHomegoalsIncrementalChange.bind(this);
    this.handleAwaygoalsIncrementalChange = this.handleAwaygoalsIncrementalChange.bind(this);
    this.sanitizeBet = this.sanitizeBet.bind(this);
  }

  componentDidMount() {
    const { userBet } = this.props;
    if (userBet === null || typeof userBet === 'undefined') {
      this.fetchUserBet();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { awaygoalsInput, hasChanges, homegoalsInput } = this.state;
    const { gameId, onSaveSuccess, shouldSave } = this.props;

    if (!shouldSave && nextProps.shouldSave) {
      if (hasChanges) {
        this.save();
      } else {
        onSaveSuccess(gameId, toResultString(homegoalsInput, awaygoalsInput),
          SavingSuccessType.UNCHANGED);
      }
    } else if (shouldSave && !nextProps.shouldSave) {
      this.setState({ hasChanges: nextProps.hadSaveIssues, isSaving: false });
    }
  }

  fetchUserBet() {
    const { gameId } = this.props;
    fetch(`${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}&bettable=${gameId}`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      if (response.ok) {
        const userBet = response.json.length > 0 ? response.json[0] : null;
        this.setState({ userBet, ...GameCardBet.goalsStateFromUserBet(userBet) });
      }
    });
  }

  // TODO P3 refactor!
  // TODO P3 DRY with ExtraBetCard, introduce BetSavingHelper
  save() {
    const {
      awaygoalsInput,
      homegoalsInput,
      isSaving,
      userBet,
    } = this.state;
    const { gameId, onSaveFailure, onSaveSuccess } = this.props;

    if (!isSaving) {
      this.setState({ isSaving: true });

      const newBet = toResultString(homegoalsInput, awaygoalsInput);
      const emptyResult = isEmptyResult(newBet);

      if (!emptyResult && !isCompleteResult(newBet)) {
        onSaveFailure(gameId, newBet, SavingErrorType.INCOMPLETE);
        return;
      }

      const body = emptyResult ? null : { bettable: gameId, result_bet: newBet };
      const betId = userBet ? userBet.id : null;

      let method;
      let url = `${API_BASE_URL}/rtg/bets/`;
      if (betId) {
        url += `${betId}/`;
        method = emptyResult ? 'DELETE' : 'PUT';
      } else {
        if (emptyResult) {
          // no previously saved bet and bet is also empty --> return
          onSaveSuccess(gameId, null, SavingSuccessType.UNCHANGED);
          return;
        }
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
              isSaving: false,
              hasChanges: false,
              userBet: response.json || null,
              ...GameCardBet.goalsStateFromUserBet(response.json),
            }, () => {
              if (method === 'POST') {
                onSaveSuccess(gameId, userBet, SavingSuccessType.ADDED);
              } else if (method === 'PUT') {
                onSaveSuccess(gameId, userBet, SavingSuccessType.UPDATED);
              } else if (method === 'DELETE') {
                onSaveSuccess(gameId, null, SavingSuccessType.DELETED);
              }
            });
          } else {
            this.setState({ isSaving: false }, () => {
              const responseDetail = response.json
                ? response.json.detail || (response.json.non_field_errors
                  ? response.json.non_field_errors[0]
                  : null) : null;
              const reasonDeadlinePassed = response.json && response.json.code
                && response.json.code[0] === 'DEADLINE_PASSED';

              onSaveFailure(gameId, newBet, reasonDeadlinePassed
                ? SavingErrorType.DEADLINE_PASSED
                : SavingErrorType.FAILED, responseDetail);
            });
          }
        }).catch(() => this.setState({ isSaving: false }, () => {
          onSaveFailure(gameId, newBet, SavingErrorType.FAILED);
        }));
    }
  }

  handleHomegoalsChange(value, betsStatusContext) {
    GameCardBet.updateBetsHaveChanges(betsStatusContext);
    this.setState({ homegoalsInput: value, hasChanges: true });
  }

  handleAwaygoalsChange(value, betsStatusContext) {
    GameCardBet.updateBetsHaveChanges(betsStatusContext);
    this.setState({ awaygoalsInput: value, hasChanges: true });
  }

  handleHomegoalsIncrementalChange(inc, betsStatusContext) {
    GameCardBet.updateBetsHaveChanges(betsStatusContext);
    this.setState(prevState => ({
      homegoalsInput: GameCardBet.getIncrementedGoal(prevState.homegoalsInput, inc),
      hasChanges: true,
    }));
  }

  handleAwaygoalsIncrementalChange(inc, betsStatusContext) {
    GameCardBet.updateBetsHaveChanges(betsStatusContext);
    this.setState(prevState => ({
      awaygoalsInput: GameCardBet.getIncrementedGoal(prevState.awaygoalsInput, inc),
      hasChanges: true,
    }));
  }

  sanitizeBet() {
    this.setState(prevState => ({
      homegoalsInput: getGoalsString(prevState.homegoalsInput),
      awaygoalsInput: getGoalsString(prevState.awaygoalsInput),
      hasChanges: true,
    }));
  }

  render() {
    const { awaygoalsInput, homegoalsInput } = this.state;
    const { gameId } = this.props;

    return (
      <BetsStatusContext.Consumer>
        {betsStatusContext => (
          <GameCardBetPresentational
            id={gameId}
            homegoals={homegoalsInput}
            awaygoals={awaygoalsInput}

            onBlur={this.sanitizeBet}
            onHomegoalsChange={(e, val) => this.handleHomegoalsChange(val, betsStatusContext)}
            onAwaygoalsChange={(e, val) => this.handleAwaygoalsChange(val, betsStatusContext)}
            onHomegoalsIncrementalChange={inc => this
              .handleHomegoalsIncrementalChange(inc, betsStatusContext)}
            onAwaygoalsIncrementalChange={inc => this
              .handleAwaygoalsIncrementalChange(inc, betsStatusContext)}
          />
        )}
      </BetsStatusContext.Consumer>
    );
  }
}

GameCardBet.defaultProps = {
  hadSaveIssues: false,
  shouldSave: false,
  userBet: null,
};

GameCardBet.propTypes = {
  gameId: PropTypes.number.isRequired,
  hadSaveIssues: PropTypes.bool,
  shouldSave: PropTypes.bool,
  userBet: PropTypes.shape(),
  onSaveFailure: PropTypes.func.isRequired,
  onSaveSuccess: PropTypes.func.isRequired,
};

export default GameCardBet;
