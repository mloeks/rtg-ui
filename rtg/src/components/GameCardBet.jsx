import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import { isCompleteResult, isEmptyResult } from '../service/ResultStringHelper';
import { BetsStatusContext } from '../service/BetsUtils';
import GameCardScoreEditor from './GameCardScoreEditor';

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

// TODO P2 optimise render cycles and state handling. On first change of any bet,
// all GameCardBets are updated (why?)
// Also: On save, all GameCardBets are updated with "shouldSave" :-/
// TODO P3 handle and display bet loading failure
// TODO P3 goals are either stored as integers when using arrows and as string when using text input
//  this is potentially dangerous and can cause nasty side effects!
class GameCardBet extends Component {
  static scoreStateFromUserBet(userBet) {
    return userBet && userBet.result_bet ? userBet.result_bet : undefined;
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
      userBet: userBet !== null ? ({ ...userBet }) : null,
      score: GameCardBet.scoreStateFromUserBet(userBet),
      hasChanges: false,
      isSaving: false,
    };

    this.handleScoreChange = this.handleScoreChange.bind(this);
    this.processSuccessfulBetSaveResponse = this.processSuccessfulBetSaveResponse.bind(this);
    this.processFailedBetSaveResponse = this.processFailedBetSaveResponse.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    const { userBet } = this.props;
    if (userBet === null || typeof userBet === 'undefined') {
      this.fetchUserBet();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { score, hasChanges } = prevState;
    const { onSaveSuccess, shouldSave } = this.props;

    // trigger save
    if (!prevProps.shouldSave && shouldSave) {
      if (hasChanges) {
        this.save();
      } else {
        // save requested, but there were no changes to this bet
        onSaveSuccess(prevProps.gameId, score, SavingSuccessType.UNCHANGED);
      }
    }
  }

  handleScoreChange(value, betsStatusContext) {
    GameCardBet.updateBetsHaveChanges(betsStatusContext);
    this.setState({ score: value, hasChanges: true });
  }

  fetchUserBet() {
    const { gameId } = this.props;
    fetch(`${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}&bettable=${gameId}`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      if (response.ok) {
        const userBet = response.json.length > 0 ? response.json[0] : null;
        this.setState({ userBet, score: GameCardBet.scoreStateFromUserBet(userBet) });
      }
    });
  }

  // TODO P3 refactor!
  // TODO P3 DRY with ExtraBetCard, introduce BetSavingHelper
  save() {
    const { isSaving, score, userBet } = this.state;
    const { gameId, onSaveFailure, onSaveSuccess } = this.props;

    if (!isSaving) {
      const emptyResult = isEmptyResult(score);

      if (!emptyResult && !isCompleteResult(score)) {
        onSaveFailure(gameId, score, SavingErrorType.INCOMPLETE);
        return;
      }

      const body = emptyResult ? null : { bettable: gameId, result_bet: score };
      const betId = userBet ? userBet.id : null;

      this.setState({ isSaving: true });

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
            this.processSuccessfulBetSaveResponse(method, response);
          } else {
            this.processFailedBetSaveResponse(score, response);
          }
        }).catch(() => this.setState({ isSaving: false }, () => {
          onSaveFailure(gameId, score, SavingErrorType.FAILED);
        }));
    }
  }

  processSuccessfulBetSaveResponse(method, response) {
    const { gameId, onSaveSuccess } = this.props;
    const userBet = response.json || null;
    this.setState({
      isSaving: false,
      hasChanges: false,
      userBet,
      score: GameCardBet.scoreStateFromUserBet(userBet),
    }, () => {
      if (method === 'POST') {
        onSaveSuccess(gameId, userBet, SavingSuccessType.ADDED);
      } else if (method === 'PUT') {
        onSaveSuccess(gameId, userBet, SavingSuccessType.UPDATED);
      } else if (method === 'DELETE') {
        onSaveSuccess(gameId, null, SavingSuccessType.DELETED);
      }
    });
  }

  processFailedBetSaveResponse(betAttempted, response) {
    const { gameId, onSaveFailure } = this.props;
    this.setState({ isSaving: false }, () => {
      const responseDetail = response.json
        ? response.json.detail || (response.json.non_field_errors
          ? response.json.non_field_errors[0]
          : null) : null;
      const reasonDeadlinePassed = response.json && response.json.code
        && response.json.code[0] === 'DEADLINE_PASSED';

      onSaveFailure(gameId, betAttempted, reasonDeadlinePassed
        ? SavingErrorType.DEADLINE_PASSED
        : SavingErrorType.FAILED, responseDetail);
    });
  }

  render() {
    const { score } = this.state;
    const { gameId } = this.props;

    return (
      <BetsStatusContext.Consumer>
        {(betsStatusContext) => (
          <GameCardScoreEditor
            gameId={gameId}
            scoreValue={score}
            onChange={(val) => this.handleScoreChange(val, betsStatusContext)}
          />
        )}
      </BetsStatusContext.Consumer>
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
  onSaveFailure: PropTypes.func.isRequired,
  onSaveSuccess: PropTypes.func.isRequired,
};

export default GameCardBet;
