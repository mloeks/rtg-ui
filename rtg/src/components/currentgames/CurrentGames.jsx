import React, { Component } from 'react';
import { format, parse } from 'date-fns';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import GameCard from '../GameCard';
import GameCardGameInfo from '../GameCardGameInfo';

class CurrentGames extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],

      loadingError: false,

      currentSliderOffset: 0,
      loadedGamesUntilOffset: 0,
      gamesDisplayed: 1,
    };

    this.loadAhead = 5;
    this.fromDate = new Date();
    // this.fromDate = parse('2018-06-24T14:00:00+02:00');
  }

  componentDidMount() {
    // TODO handle pagination params properly
    this.fetchData(`${API_BASE_URL}/rtg/games/?offset=0&limit=5&from=${encodeURIComponent(format(this.fromDate))}`, 'games', true);
    this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets', false);
  }

  fetchData(url, targetStateField, isPaginated) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? { [targetStateField]: isPaginated ? response.json.results : response.json }
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  render() {
    return (
      <section className="CurrentGames">
        {this.state.games.map(game => {
          // TODO also load bets
          // const userBet = bets.find(bet => bet.bettable === game.id) || {};
          const userBet = {
            result_bet_type: '',
            points: 0,
            result_bet: null,
          };
          return (
            <GameCard key={game.id} userBet={userBet} {...game}>
              <GameCardGameInfo
                city={game.city}
                kickoff={parse(game.kickoff)}
                result={game.homegoals !== -1 && game.awaygoals !== -1 ? `${game.homegoals} : ${game.awaygoals}` : null}
                resultBetType={userBet.result_bet_type}
                points={userBet.points}
                userBet={userBet.result_bet}
              />
            </GameCard>
          );
        })}
      </section>
    );
  }
}

CurrentGames.propTypes = {};

export default CurrentGames;
