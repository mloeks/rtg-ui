import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  addDays, format, isSameDay, parseISO, subDays, toDate,
} from 'date-fns';
import de from 'date-fns/locale/de';

import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import RtgSeparator from '../RtgSeparator';
import GameCard from '../GameCard';
import NullGameCard from '../NullGameCard';
import GameCardGameInfo from '../GameCardGameInfo';
import GameCardBet, { SavingErrorType } from '../GameCardBet';
import Notification, { NotificationType } from '../Notification';

import './CurrentGameCard.scss';

class CurrentGameCard extends Component {
  static getFormattedKickoffDate(kickoff) {
    if (isSameDay(kickoff, subDays(new Date(), 1))) { return 'Gestern'; }
    if (isSameDay(new Date(), kickoff)) { return 'Heute'; }
    if (isSameDay(kickoff, addDays(new Date(), 1))) { return 'Morgen'; }

    return format(kickoff, 'EEEEEE. d. LLLL', { locale: de });
  }

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
    const { onBetEditStart } = this.props;
    this.setState({ betSaveFailed: false, editingBet: true, editingBetSuccessful: false });
    onBetEditStart();
  }

  handleBetEditCancel() {
    const { onBetEditCancel } = this.props;
    this.setState({ editingBet: false }, () => { onBetEditCancel(); });
  }

  handleBetSave() {
    this.setState({ shouldSaveBet: true });
  }

  handleBetSaveFailure(gameId, attemptedBet, type) {
    this.setState({ betSaveFailed: true, betSaveFailedType: type, shouldSaveBet: false });
  }

  handleBetSaveSuccess(gameId, newBet) {
    const { onBetEditDone, userBet } = this.props;
    this.setState({ editingBet: false, editingBetSuccessful: true, shouldSaveBet: false });
    const updatedBetId = userBet ? userBet.id : null;
    onBetEditDone(updatedBetId, newBet);
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
        shouldSaveBet: false,
      };
    });
  }

  render() {
    const {
      betSaveFailed,
      betSaveFailedType,
      editingBet,
      editingBetSuccessful,
      shouldSaveBet,
    } = this.state;
    const { game, theme, userBet } = this.props;

    const formattedRoundInfo = (_game) => {
      if (!_game) return '...';
      const roundName = _game.round_details.name;
      const groupName = _game.group ? _game.group.name : null;
      if (groupName) {
        return `${roundName} - ${groupName}`;
      }
      return roundName;
    };
    return (
      <div className="CurrentGameCard">
        <RtgSeparator
          content={game
            ? (
              <div>
                {CurrentGameCard.getFormattedKickoffDate(parseISO(game.kickoff))}
                <br />
                <span
                  style={{
                    fontSize: '12px',
                    color: theme.palette.grey['400'],
                    textTransform: 'initial',
                    letterSpacing: 0,
                  }}
                >
                  {formattedRoundInfo(game)}
                </span>
              </div>
            )
            : '...'}
          contentStyle={{ margin: 0 }}
          style={{ marginBottom: 10 }}
        />

        {game ? (
          <GameCard
            displayTeamNames="small"
            hometeam={game.hometeam_name}
            hometeamAbbrev={game.hometeam_abbreviation}
            awayteam={game.awayteam_name}
            awayteamAbbrev={game.awayteam_abbreviation}
          >
            {editingBet ? (
              <GameCardBet
                gameId={game.id}
                hadSaveIssues={editingBet && betSaveFailed}
                shouldSave={shouldSaveBet}
                userBet={userBet}
                onSaveFailure={this.handleBetSaveFailure}
                onSaveSuccess={this.handleBetSaveSuccess}
              />
            ) : (
              <GameCardGameInfo
                city={game.city}
                kickoff={toDate(parseISO(game.kickoff))}
                result={game.homegoals !== -1 && game.awaygoals !== -1 ? `${game.homegoals} : ${game.awaygoals}` : null}
                resultBetType={userBet ? userBet.result_bet_type : null}
                points={userBet ? userBet.points : null}
                userBet={userBet ? userBet.result_bet : null}
              />
            )}
          </GameCard>
        ) : <NullGameCard />}

        {game && game.bets_open && (
          <div className="CurrentGameCard__actions">
            {editingBet && (
              <>
                <Button
                  color="primary"
                  icon={<SaveIcon style={{ width: 20, height: 20 }} />}
                  disabled={shouldSaveBet}
                  onClick={this.handleBetSave}
                >
                  Speichern
                </Button>
                <br />
                <Button onClick={this.handleBetEditCancel}>Abbrechen</Button>
              </>
            )}

            {(!editingBet && !editingBetSuccessful)
            && (
              <Button
                color="primary"
                icon={<EditIcon style={{ width: 20, height: 20 }} />}
                onClick={this.handleBetEdit}
              >
                {userBet ? 'Tipp ändern' : 'Tipp abgeben'}
              </Button>
            )}

            {editingBetSuccessful && (
              <Notification
                type={NotificationType.SUCCESS}
                title="Gespeichert"
                dismissable
                disappearAfterMs={2000}
                containerStyle={{ margin: '3px auto', maxWidth: 215 }}
                onClose={() => this.setState({ editingBetSuccessful: false })}
              />
            )}
          </div>
        )}

        <Dialog open={betSaveFailed} onClose={this.handleBetSaveErrorInfoDialogClosed}>
          <DialogTitle>Speichern fehlgeschlagen</DialogTitle>
          <DialogContent>
            {betSaveFailedType === SavingErrorType.INCOMPLETE
              && 'Bitte gib einen vollständigen Tipp ein.'}
            {betSaveFailedType === SavingErrorType.DEADLINE_PASSED
              && 'Die Deadline für diesen Tipp ist abgelaufen. Eine Tippabgabe ist daher leider nicht mehr möglich.'}
            {betSaveFailedType === SavingErrorType.FAILED
              && 'Das Speichern des Tipps ist leider fehlgeschlagen. Bitte versuche es erneut.'}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleBetSaveErrorInfoDialogClosed}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

CurrentGameCard.defaultProps = {
  game: null,
  userBet: null,
  onBetEditStart: () => {},
  onBetEditCancel: () => {},
};

CurrentGameCard.propTypes = {
  game: PropTypes.shape(),
  userBet: PropTypes.shape(),
  onBetEditStart: PropTypes.func,
  onBetEditCancel: PropTypes.func,
  onBetEditDone: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(CurrentGameCard);
