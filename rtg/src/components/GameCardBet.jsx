import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import {
  getGoalsString,
  isCompleteResult,
  isEmptyResult,
  NO_GOALS_STRING,
  toResultString,
} from '../service/ResultStringHelper';
import GameCardBetPresentational from './GameCardBetPresentational';

export const SavingErrorType = {
  INCOMPLETE: 'INCOMPLETE',
};

// TODO P1 refactor such that only userBet us used from state, remove homegoalsInput and awaygoalsInput
// on update directly update userBet string, and extract home and awaygoals in the render-method
// TODO ANSCHLUSS save: PUT hat funktioniert, aber aus obigen Gründen werden geladene Bets noch gar nicht
// richtig angezeigt. Alle anderen Einzelfälle testen, dann um Handling in parent Komponente kümmern.
// TODO P1 handle & display loadingError
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

      hasChanges: false,

      isSaving: false,
      loadingError: false,
    };

    this.save = this.save.bind(this);
    this.handleHomegoalsChange = this.handleHomegoalsChange.bind(this);
    this.handleAwaygoalsChange = this.handleAwaygoalsChange.bind(this);
    this.handleHomegoalsIncrementalChange = this.handleHomegoalsIncrementalChange.bind(this);
    this.handleAwaygoalsIncrementalChange = this.handleAwaygoalsIncrementalChange.bind(this);
    this.sanitizeBet = this.sanitizeBet.bind(this);
  }

  componentDidMount() {
    this.fetchUserBet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldSave && this.state.hasChanges) {
      this.save();
    }
  }

  fetchUserBet() {
    return fetch(`${API_BASE_URL}/rtg/bets/?bettable=${this.props.gameId}`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ?
            { userBet: response.json.length > 0 ? response.json[0] : null }
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  // TODO P2 refactor!
  // TODO P3 DRY with ExtraBetCard, introduce BetSavingHelper
  save() {
    if (!this.state.isSaving) {
      this.setState({ isSaving: true });

      const newBet = toResultString(this.state.homegoalsInput, this.state.awaygoalsInput);
      const emptyResult = isEmptyResult(newBet);

      if (!newBet || !isCompleteResult(newBet)) {
        this.props.onSavingError(this.props.gameId, SavingErrorType.INCOMPLETE);
      }

      const body = emptyResult ? null : { bettable: this.props.gameId, result_bet: newBet };

      let method;
      let url = `${API_BASE_URL}/rtg/bets/`;
      if (this.state.userBet && this.state.userBet.id) {
        url += `${this.state.userBet.id}/`;
        method = emptyResult ? 'DELETE' : 'PUT';
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
              isSaving: false,
              hasChanges: false,
              userBet: response.json || null,
            }, () => {
              if (method === 'POST') {
                this.props.onBetAdded(this.props.gameId);
              } else if (method === 'PUT') {
                this.props.onBetUpdated(this.props.gameId);
              } else if (method === 'DELETE') {
                this.props.onBetRemoved(this.props.gameId);
              }
            });
          } else {
            this.setState({ isSaving: false }, () => {
              this.props.onSavingError(this.props.gameId, response.json.detail);
            });
          }
        }).catch(() => this.setState({ isSaving: false }, () => {
          this.props.onSavingError(this.props.gameId);
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
};

GameCardBet.propTypes = {
  gameId: PropTypes.number.isRequired,
  shouldSave: PropTypes.bool,

  onBetAdded: PropTypes.func.isRequired,
  onBetUpdated: PropTypes.func.isRequired,
  onBetRemoved: PropTypes.func.isRequired,
  onSavingError: PropTypes.func.isRequired,
};

export default GameCardBet;
