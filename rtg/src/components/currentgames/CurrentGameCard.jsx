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
import GameCardBet from '../GameCardBet';

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
      editingBet: false,
      shouldSaveBet: false,
    };

    this.handleBetEdit = this.handleBetEdit.bind(this);
    this.handleBetSave = this.handleBetSave.bind(this);
    this.handleBetSaveDone = this.handleBetSaveDone.bind(this);
  }

  handleBetEdit() {
    this.setState({ betSaveFailed: false, editingBet: true });
  }

  handleBetSave() {
    this.setState({ shouldSaveBet: true });
  }

  handleBetSaveDone(id, bet, type, detail) {
    // TODO P2 check saving/error type for errors and only call onBetSaveDone on parent if it was successful
    // TODO P2 consume betinfo context and update bet count if required - maybe producer needs to be hoisted
    // up into the header or page (or another similar producer has to be used for this page)...
    this.setState({ editingBet: false, shouldSaveBet: false });
    this.props.onBetEditDone(id, bet, type, detail);
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
                  onClick={this.handleBetSave}
                  style={{ height: '26px', lineHeight: '26px' }}
                  labelStyle={{ fontSize: '12px' }}
                /><br />
                <FlatButton
                  label="Abbrechen"
                  onClick={() => this.setState({ editingBet: false })}
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
  onBetEditDone: PropTypes.func.isRequired,
};

export default CurrentGameCard;
