import React, { Component } from 'react';
import { parse } from 'date-fns';
import { IconButton } from 'material-ui';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { viewportW } from 'verge';
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
    return 12;
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

  static getGamesToDisplay() {
    const vw = viewportW();
    if (vw < 640) { return 1; }
    if (vw < 1280) { return 2; }
    return 3;
  }

  constructor(props) {
    super(props);

    this.state = {
      bets: [],
      games: [],

      loadingError: false,

      currentOffset: 0,
      gamesToDisplay: CurrentGames.getGamesToDisplay(),
    };

    this.mediaQueryList = [
      window.matchMedia('(max-width: 640px)'),
      window.matchMedia('(max-width: 1280px)'),
    ];
    this.loadGamesAroundView = 3;

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.fetchMoreGamesIfRequired = this.fetchMoreGamesIfRequired.bind(this);
    this.canScrollForward = this.canScrollForward.bind(this);
    this.canScrollBackward = this.canScrollBackward.bind(this);
    this.scrollForward = this.scrollForward.bind(this);
    this.scrollBackward = this.scrollBackward.bind(this);
  }

  componentDidMount() {
    this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets', false, (prevState, response) => ({ bets: response }));
    this.fetchKickoffs();

    this.mediaQueryList.forEach(mql => mql.addListener(this.onBreakpointChange));
  }

  componentWillUnmount() {
    this.mediaQueryList.forEach(mql => mql.removeEventListener(this.onBreakpointChange));
  }

  onBreakpointChange() {
    this.setState({ gamesToDisplay: CurrentGames.getGamesToDisplay() });
  }

  fetchData(url, targetStateField, isPaginated, responseToStateMapper) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      this.setState(prevState => (response.ok ?
        { ...responseToStateMapper(prevState, isPaginated ? response.json.results : response.json) }
        : { loadingError: true }
      ));
    }).catch(() => this.setState({ loadingError: true }));
  }

  fetchGames(offset) {
    const gamesUrl = `${API_BASE_URL}/rtg/games/?offset=${offset}&limit=${this.state.gamesToDisplay}`;
    this.fetchData(gamesUrl, 'games', true, (prevState, games) =>
      CurrentGames.gamesExcerptResponseToState(prevState, games, offset));
  }

  fetchKickoffs() {
    fetch(`${API_BASE_URL}/rtg/game-kickoffs/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      if (response.ok) {
        const kickoffs = response.json;
        const initialOffset = CurrentGames.getInitialOffsetBasedOnDate(kickoffs);
        this.setState(() => ({
          games: Array(kickoffs.length),
          currentOffset: initialOffset,
        }), () => { this.fetchGames(initialOffset); });
      } else {
        this.setState(() => ({ loadingError: true }));
      }
    }).catch(() => this.setState({ loadingError: true }));
  }

  fetchMoreGamesIfRequired() {
    // TODO find out if more games need to be loaded based on window + gamesAround and trigger the request
    console.log(this.state.games);
    console.log(this.state.currentOffset);
  }

  canScrollForward() {
    return this.state.currentOffset + this.state.gamesToDisplay < this.state.games.length;
  }

  canScrollBackward() { return this.state.currentOffset > 0; }

  scrollForward() {
    this.setState((prevState) => {
      const nextOffset = prevState.currentOffset + prevState.gamesToDisplay;
      const maxOffset = prevState.games.length - prevState.gamesToDisplay;
      return { currentOffset: Math.min(nextOffset, maxOffset) };
    }, this.fetchMoreGamesIfRequired);
  }

  scrollBackward() {
    this.setState((prevState) => {
      const nextOffset = prevState.currentOffset - prevState.gamesToDisplay;
      return { currentOffset: Math.max(nextOffset, 0) };
    }, this.fetchMoreGamesIfRequired);
  }

  render() {
    const gamesToDisplayWindow = CurrentGames
      .range(this.state.currentOffset, this.state.currentOffset + this.state.gamesToDisplay);
    return (
      this.state.games ? (
        <section className="CurrentGames">
          {this.canScrollBackward() &&
            <IconButton onClick={this.scrollBackward}><HardwareKeyboardArrowLeft /></IconButton>}
          {this.canScrollForward() &&
            <IconButton onClick={this.scrollForward}><HardwareKeyboardArrowRight /></IconButton>}


          {gamesToDisplayWindow.map((offset) => {
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
            // TODO style loading state
            return <div key={`empty-game-${offset}`}>--- LEER ---</div>;
          })}
        </section>) : null);
  }
}

CurrentGames.propTypes = {};

export default CurrentGames;
