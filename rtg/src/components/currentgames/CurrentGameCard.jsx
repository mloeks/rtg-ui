import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { format, isToday, isTomorrow, isYesterday, parse } from 'date-fns';
import de from 'date-fns/locale/de';
import { FlatButton } from 'material-ui';
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
      betSaveFailedReason: null,
      editingBet: false,
      shouldSaveBet: false,
    };

    this.handleBetEdit = this.handleBetEdit.bind(this);
    this.handleBetEditCancel = this.handleBetEditCancel.bind(this);
    this.handleBetSave = this.handleBetSave.bind(this);
    this.handleBetSaveDone = this.handleBetSaveDone.bind(this);
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

  handleBetSaveDone(gameId, resultBetString, type) {
    // TODO P2 consume betinfo context and update bet count if required - maybe producer needs to be hoisted
    // up into the header or page (or another similar producer has to be used for this page)...
    // TODO P1 test in IE, 'includes' might need another polyfill
    if (Object.keys(SavingErrorType).includes(type)) {
      // TODO display and communicate errors
      this.setState({ betSaveFailed: true, betSaveFailedType: type, shouldSaveBet: false });
      return;
    }

    if (type === SavingSuccessType.ADDED) {
      // TODO update context
    }
    if (type === SavingSuccessType.DELETED) {
      // TODO update context
    }
    this.setState({ editingBet: false, shouldSaveBet: false });

    const updatedBetId = this.props.userBet ? this.props.userBet.id : null;
    const newBet = type !== SavingSuccessType.DELETED ? resultBetString : null;
    this.props.onBetEditDone(updatedBetId, newBet);
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
                onSaveDone={this.handleBetSaveDone}
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
                  icon={<ContentSave style={{ width: 18, height: 18 }} />}
                  disabled={this.state.shouldSaveBet}
                  onClick={this.handleBetSave}
                  style={{ height: '26px', lineHeight: '26px' }}
                  labelStyle={{ fontSize: '12px' }}
                /><br />
                <FlatButton
                  label="Abbrechen"
                  onClick={this.handleBetEditCancel}
                  style={{ height: '26px', lineHeight: '26px' }}
                  labelStyle={{ fontSize: '12px' }}
                />
              </Fragment>
              ) : (
                <FlatButton
                  label="Tipp ändern"
                  primary
                  icon={<ImageEdit style={{ width: 18, height: 18 }} />}
                  onClick={this.handleBetEdit}
                  style={{ height: '26px', lineHeight: '26px' }}
                  labelStyle={{ fontSize: '12px' }}
                />
              )}
          </div>
        )}
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
