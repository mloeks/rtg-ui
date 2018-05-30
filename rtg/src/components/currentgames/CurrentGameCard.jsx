import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'date-fns';
import GameCard from '../GameCard';
import GameCardGameInfo from '../GameCardGameInfo';
import NullGameCard from '../NullGameCard';

import './CurrentGameCard.css';

class CurrentGameCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="CurrentGameCard">
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
