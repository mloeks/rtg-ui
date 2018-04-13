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
  NO_GOALS_STRING,
  toResultString,
} from '../service/ResultStringHelper';
import GameCardBetPresentational from './GameCardBetPresentational';

export const SavingSuccessType = {
  UNCHANGED: 'UNCHANGED',
  ADDED: 'ADDED',
  UPDATED: 'UPDATED',
  DELETED: 'DELETED',
};

export const SavingErrorType = {
  INCOMPLETE: 'INCOMPLETE',
  FAILED: 'FAILED',
};

// TODO P3 handle and display bet loading failure
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

  static goalsStateFromUserBet(userBet) {
    const resultAvailable = userBet && userBet.result_bet;
    return {
      homegoalsInput: resultAvailable ? getHomegoals(userBet.result_bet) : NO_GOALS_STRING,
      awaygoalsInput: resultAvailable ? getAwaygoals(userBet.result_bet) : NO_GOALS_STRING,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      userBet: this.props.userBet !== null ? Object.assign({}, this.props.userBet) : null,
      ...GameCardBet.goalsStateFromUserBet(this.props.userBet),
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
    if (this.props.userBet === null || typeof this.props.userBet === 'undefined') {
      this.fetchUserBet();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldSave) {
      if (this.state.hasChanges) {
        this.save();
      } else {
        this.props.onSaveDone(
          this.props.gameId,
          toResultString(this.state.homegoalsInput, this.state.awaygoalsInput),
          SavingSuccessType.UNCHANGED,
        );
      }
    } else {
      this.setState({ hasChanges: false, isSaving: false });
    }
  }

  fetchUserBet() {
    fetch(`${API_BASE_URL}/rtg/bets/?bettable=${this.props.gameId}`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          const userBet = response.json.length > 0 ? response.json[0] : null;
          this.setState({ userBet, ...GameCardBet.goalsStateFromUserBet(userBet) });
        }
      });
  }

  // TODO P2 refactor!
  // TODO P3 DRY with ExtraBetCard, introduce BetSavingHelper
  save() {
    if (!this.state.isSaving) {
      this.setState({ isSaving: true });

      const newBet = toResultString(this.state.homegoalsInput, this.state.awaygoalsInput);
      const emptyResult = isEmptyResult(newBet);

      if (!emptyResult && !isCompleteResult(newBet)) {
        this.props.onSaveDone(this.props.gameId, newBet, SavingErrorType.INCOMPLETE);
        return;
      }

      const body = emptyResult ? null : { bettable: this.props.gameId, result_bet: newBet };
      const betId = this.state.userBet ? this.state.userBet.id : null;

      let method;
      let url = `${API_BASE_URL}/rtg/bets/`;
      if (betId) {
        url += `${betId}/`;
        method = emptyResult ? 'DELETE' : 'PUT';
      } else {
        if (emptyResult) {
          // no previously saved bet and bet is also empty --> return
          this.props.onSaveDone(this.props.gameId, newBet, SavingSuccessType.UNCHANGED);
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
                this.props.onSaveDone(this.props.gameId, newBet, SavingSuccessType.ADDED);
              } else if (method === 'PUT') {
                this.props.onSaveDone(this.props.gameId, newBet, SavingSuccessType.UPDATED);
              } else if (method === 'DELETE') {
                this.props.onSaveDone(this.props.gameId, newBet, SavingSuccessType.DELETED);
              }
            });
          } else {
            this.setState({ isSaving: false }, () => {
              const responseDetail = response.json.detail ||
                (response.json.non_field_errors ? response.json.non_field_errors[0] : null);
              this.props
                .onSaveDone(this.props.gameId, newBet, SavingErrorType.FAILED, responseDetail);
            });
          }
        }).catch(() => this.setState({ isSaving: false }, () => {
          this.props.onSaveDone(this.props.gameId, newBet, SavingErrorType.FAILED);
        }));
    }
  }

  handleHomegoalsChange(e, value) { this.setState({ homegoalsInput: value, hasChanges: true }); }
  handleAwaygoalsChange(e, value) { this.setState({ awaygoalsInput: value, hasChanges: true }); }

  handleHomegoalsIncrementalChange(inc) {
    this.setState(prevState => ({
      homegoalsInput: GameCardBet.getIncrementedGoal(prevState.homegoalsInput, inc),
      hasChanges: true,
    }));
  }

  handleAwaygoalsIncrementalChange(inc) {
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

GameCardBet.defaultProps = {
  shouldSave: false,
  userBet: null,
};

GameCardBet.propTypes = {
  gameId: PropTypes.number.isRequired,
  shouldSave: PropTypes.bool,
  userBet: PropTypes.shape(),
  onSaveDone: PropTypes.func.isRequired,
};

export default GameCardBet;
