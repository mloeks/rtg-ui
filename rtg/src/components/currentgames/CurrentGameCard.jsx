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
import GameCardBet, { SavingErrorType } from '../GameCardBet';
import Notification, { NotificationType } from '../Notification';
import { lightGrey } from '../../theme/RtgTheme';

import './CurrentGameCard.css';

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
      editingBetSuccessful: false,
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
    this.setState({ betSaveFailed: false, editingBet: true, editingBetSuccessful: false });
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

  handleBetSaveSuccess(gameId, newBet) {
    this.setState({ editingBet: false, editingBetSuccessful: true, shouldSaveBet: false });
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
    const formattedRoundInfo = (game) => {
      if (!game) return '...';
      const roundName = game.round_details.name;
      const groupName = game.group ? game.group.name : null;
      if (groupName) {
        return `${roundName} - ${groupName}`;
      }
      return roundName;
    };
    return (
      <div className="CurrentGameCard">
        <RtgSeparator
          content={this.props.game ?
            <div>
              {CurrentGameCard.getFormattedKickoffDate(this.props.game.kickoff)}<br />
              <span style={{
                fontSize: '12px',
                color: lightGrey,
                textTransform: 'initial',
                letterSpacing: 0
              }}>{formattedRoundInfo(this.props.game)}
              </span>
            </div> : '...'}
          contentStyle={{ margin: 0 }}
          style={{ marginBottom: 10 }}
        />

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
            {this.state.editingBet && (
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
              </Fragment>)}

            {(!this.state.editingBet && !this.state.editingBetSuccessful) && (
              <FlatButton
                label={this.props.userBet ? 'Tipp ändern' : 'Tipp abgeben'}
                primary
                icon={<ImageEdit style={{ width: 20, height: 20 }} />}
                onClick={this.handleBetEdit}
              />)}

            {this.state.editingBetSuccessful && (
              <Notification
                type={NotificationType.SUCCESS}
                title="Gespeichert"
                dismissable
                disappearAfterMs={2000}
                containerStyle={{ margin: '0 auto', maxWidth: 185 }}
                style={{ padding: '5px' }}
                onClose={() => this.setState({ editingBetSuccessful: false })}
              />)}
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
