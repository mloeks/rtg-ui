import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format, isToday, isTomorrow, isYesterday, parse } from 'date-fns';
import de from 'date-fns/locale/de';
import GameCard from '../GameCard';
import GameCardGameInfo from '../GameCardGameInfo';
import NullGameCard from '../NullGameCard';

import './CurrentGameCard.css';
import RtgSeparator from "../RtgSeparator";

class CurrentGameCard extends Component {
  static getFormattedKickoffDate(kickoff) {
    if (isYesterday(kickoff)) { return "Gestern"; }
    if (isToday(kickoff)) { return 'Heute'; }
    if (isTomorrow(kickoff)) { return 'Morgen'; }

    return format(kickoff, 'dd. D. MMMM', { locale: de });
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="CurrentGameCard">
        <RtgSeparator content={this.props.game ?
          CurrentGameCard.getFormattedKickoffDate(this.props.game.kickoff) : '...'} />

        {this.props.game ? (
          <GameCard displayTeamNames="small" {...this.props.game}>
            <GameCardGameInfo
              city={this.props.game.city}
              kickoff={parse(this.props.game.kickoff)}
              result={this.props.game.homegoals !== -1 && this.props.game.awaygoals !== -1 ? `${this.props.game.homegoals} : ${this.props.game.awaygoals}` : null}
              resultBetType={this.props.userBet ? this.props.userBet.result_bet_type : null}
              points={this.props.userBet ? this.props.userBet.points : null}
              userBet={this.props.userBet ? this.props.userBet.result_bet : null}
            />
          </GameCard>
        ) : <NullGameCard />}
      </div>
    );
  }
}

CurrentGameCard.defaultProps = {
  game: null,
  userBet: null,
};

CurrentGameCard.propTypes = {
  game: PropTypes.shape(),
  userBet: PropTypes.shape(),
};

export default CurrentGameCard;
