import React, { Component } from 'react';
import { parse } from 'date-fns';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import GameCard from '../GameCard';
import GameCardGameInfo from '../GameCardGameInfo';

class CurrentGames extends Component {
  static range(start, end) {
    return Array.from({ length: (end - start) }, (v, k) => k + start);
  }

  static getInitialOffsetBasedOnDate(kickoffs) {
    // TODO calculate initial offset based on current date
    return 3;
  }

  static gamesExcerptResponseToState(prevState, games, offset) {
    const updatedGames = prevState.games.slice(0);
    games.forEach((game, ix) => {
      if (!updatedGames[offset + ix]) {
        updatedGames[offset + ix] = game;
      }
    });
    return { games: updatedGames };
  }

  constructor(props) {
    super(props);

    this.state = {
      bets: [],
      games: [],
      kickoffs: [], // chronological list of game kickoffs only

      loadingError: false,

      currentOffset: 0,
      gamesToDisplay: 3,
    };

    this.loadAhead = 5;
    this.fromDate = new Date();
    // this.fromDate = parse('2018-06-24T14:00:00+02:00');
  }

  componentDidMount() {
    this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets', false, (prevState, response) => ({ bets: response }));

    fetch(`${API_BASE_URL}/rtg/game-kickoffs/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          const kickoffs = response.json;
          const initialOffset = CurrentGames.getInitialOffsetBasedOnDate(kickoffs);
          this.setState(() => {
            return {
              kickoffs,
              games: Array(kickoffs.length),
              currentOffset: initialOffset,
            };
          }, () => {
            const gamesUrl = `${API_BASE_URL}/rtg/games/?offset=${initialOffset}&limit=${this.state.gamesToDisplay}`;
            this.fetchData(gamesUrl, 'games', true, (prevState, games) =>
              CurrentGames.gamesExcerptResponseToState(prevState, games, initialOffset));
          });
        } else {
          this.setState(() => ({ loadingError: true }));
        }
      }).catch(() => this.setState({ loadingError: true }));
  }

  fetchData(url, targetStateField, isPaginated, successResponseToStateMapper) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(prevState => (
          response.ok
            ? { ...successResponseToStateMapper(prevState, isPaginated ? response.json.results : response.json) }
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  render() {
    const gamesToDisplayWindow = CurrentGames
      .range(this.state.currentOffset, this.state.currentOffset + this.state.gamesToDisplay);
    return (
      this.state.games ? (
        <section className="CurrentGames">
          {gamesToDisplayWindow.map(offset => {
            // TODO also load bets
            const game = this.state.games[offset];
            if (game) {
              const userBet = this.state.bets.find(bet => bet.bettable === game.id) || {};
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
            }
            return null;
          })}
        </section>) : null);
  }
}

CurrentGames.propTypes = {};

export default CurrentGames;
