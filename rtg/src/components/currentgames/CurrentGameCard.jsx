import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { format, isToday, isTomorrow, isYesterday, parse } from 'date-fns';
import de from 'date-fns/locale/de';
import { Dialog, FlatButton } from 'material-ui';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import ContentSave from 'material-ui/svg-icons/content/save';
import RtgSeparator from '../RtgSeparator';
import GameCard from '../GameCard';
import NullGameCard from '../NullGameCard';
import GameCardGameInfo from '../GameCardGameInfo';
import GameCardBet, { SavingErrorType, SavingSuccessType } from '../GameCardBet';

import './CurrentGameCard.css';

// TODO P2 Also display round and group info somewhere here
class CurrentGameCard extends Component {
  static getFormattedKickoffDate(kickoff) {
    if (isYesterday(kickoff)) { return "Gestern"; }
    if (isToday(kickoff)) { return 'Heute'; }
    if (isTomorrow(kickoff)) { return 'Morgen'; }

    return format(kickoff, 'dd. D. MMMM', { locale: de });
  };

  constructor(props) {
    super(props);
    this.state = {
      betSaveFailed: false,
      betSaveFailedType: null,
      editingBet: false,
      shouldSaveBet: false,
    };

    this.handleBetEdit = this.handleBetEdit.bind(this);
    this.handleBetEditCancel = this.handleBetEditCancel.bind(this);
    this.handleBetSave = this.handleBetSave.bind(this);
    this.handleBetSaveFailure = this.handleBetSaveFailure.bind(this);
    this.handleBetSaveSuccess = this.handleBetSaveSuccess.bind(this);
    this.handleBetSaveErrorInfoDialogClosed = this.handleBetSaveErrorInfoDialogClosed.bind(this);
  }

  handleBetEdit() {
    this.setState({ betSaveFailed: false, editingBet: true });
    this.props.onBetEditStart();
  }

  handleBetEditCancel() {
    this.setState({ editingBet: false }, () => {
      this.props.onBetEditCancel();
    })
  }

  handleBetSave() {
    this.setState({ shouldSaveBet: true });
  }

  handleBetSaveFailure(gameId, attemptedBet, type) {
    this.setState({ betSaveFailed: true, betSaveFailedType: type, shouldSaveBet: false });
  }

  handleBetSaveSuccess(gameId, newBet, type) {
    // TODO P2 consume betinfo context and update bet count if required - maybe producer needs to be hoisted
    // up into the header or page (or another similar producer has to be used for this page)...
    // idea: make a HOC out of the provide in Bets.jsx? "withBetsStatus"
    if (type === SavingSuccessType.ADDED) {
      // TODO update context
    }
    if (type === SavingSuccessType.DELETED) {
      // TODO update context
    }
    this.setState({ editingBet: false, shouldSaveBet: false });

    const updatedBetId = this.props.userBet ? this.props.userBet.id : null;
    this.props.onBetEditDone(updatedBetId, newBet);
  }

  handleBetSaveErrorInfoDialogClosed() {
    this.setState((prevState, prevProps) => {
      let cancelEdit = false;
      if (prevState.betSaveFailedType !== SavingErrorType.INCOMPLETE) {
        prevProps.onBetEditCancel();
        cancelEdit = true;
      }
      return {
        editingBet: !cancelEdit,
        betSaveFailed: false,
        betSaveFailedType: null,
        shouldSaveBet: false
      };
    });
  }

  render() {
    return (
      <div className="CurrentGameCard">
        <RtgSeparator content={this.props.game ?
          CurrentGameCard.getFormattedKickoffDate(this.props.game.kickoff) : '...'} />

        {this.props.game ? (
          <GameCard displayTeamNames="small" {...this.props.game}>
            {this.state.editingBet ? (
              <GameCardBet
                gameId={this.props.game.id}
                hadSaveIssues={this.state.editingBet && this.state.betSaveFailed}
                shouldSave={this.state.shouldSaveBet}
                userBet={this.props.userBet}
                onSaveFailure={this.handleBetSaveFailure}
                onSaveSuccess={this.handleBetSaveSuccess}
              />
            ) : (
              <GameCardGameInfo
                city={this.props.game.city}
                kickoff={parse(this.props.game.kickoff)}
                result={this.props.game.homegoals !== -1 && this.props.game.awaygoals !== -1 ? `${this.props.game.homegoals} : ${this.props.game.awaygoals}` : null}
                resultBetType={this.props.userBet ? this.props.userBet.result_bet_type : null}
                points={this.props.userBet ? this.props.userBet.points : null}
                userBet={this.props.userBet ? this.props.userBet.result_bet : null}
              />
            )}
          </GameCard>
        ) : <NullGameCard />}

        {this.props.game && this.props.game.bets_open && (
          <div className="CurrentGameCard__actions">
            {this.state.editingBet ? (
              <Fragment>
                <FlatButton
                  label="Speichern"
                  primary
                  icon={<ContentSave style={{ width: 20, height: 20 }} />}
                  disabled={this.state.shouldSaveBet}
                  onClick={this.handleBetSave}
                /><br />
                <FlatButton
                  label="Abbrechen"
                  onClick={this.handleBetEditCancel}
                />
              </Fragment>
              ) : (
                <FlatButton
                  label={this.props.userBet ? 'Tipp ändern' : 'Tipp abgeben'}
                  primary
                  icon={<ImageEdit style={{ width: 20, height: 20 }} />}
                  onClick={this.handleBetEdit}
                />
              )}
          </div>
        )}

        <Dialog
          modal={false}
          actions={[
            <FlatButton
              label="Ok"
              primary
              onClick={this.handleBetSaveErrorInfoDialogClosed}
            />]}
          open={this.state.betSaveFailed}
          onRequestClose={this.handleBetSaveErrorInfoDialogClosed}
        >
          {this.state.betSaveFailedType === SavingErrorType.INCOMPLETE &&
            'Bitte gib einen vollständigen Tipp ein.'}
          {this.state.betSaveFailedType === SavingErrorType.DEADLINE_PASSED &&
            'Die Deadline für diesen Tipp ist abgelaufen. Eine Tippabgabe ist daher leider nicht mehr möglich.'}
          {this.state.betSaveFailedType === SavingErrorType.FAILED &&
            'Das Speichern des Tipps ist leider fehlgeschlagen. Bitte versuche es erneut.'}
        </Dialog>
      </div>
    );
  }
}

CurrentGameCard.defaultProps = {
  game: null,
  userBet: null,
  onBetEditStart: () => {},
};

CurrentGameCard.propTypes = {
  game: PropTypes.shape(),
  userBet: PropTypes.shape(),
  onBetEditStart: PropTypes.func,
  onBetEditCancel: PropTypes.func,
  onBetEditDone: PropTypes.func.isRequired,
};

export default CurrentGameCard;
