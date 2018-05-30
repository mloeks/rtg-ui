import React, { Component } from 'react';
import { IconButton } from 'material-ui';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { viewportW } from 'verge';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import CurrentGameCard from './CurrentGameCard';

import './CurrentGames.css';

const SCROLL_BUTTON_SIZE = 50;

// TODO P2 add "today" button if one scrolls around all games ;-)
class CurrentGames extends Component {
  static range(start, end) {
    return Array.from({ length: (end - start) }, (v, k) => k + start);
  }

  static gamesExcerptResponseToState(prevState, games, fromOffset) {
    const updatedGames = prevState.games.slice(0);
    games.forEach((game, ix) => {
      if (updatedGames[fromOffset + ix] === null) {
        updatedGames[fromOffset + ix] = game;
      }
    });
    return { games: updatedGames };
  }

  static getGamesToDisplay() {
    const vw = viewportW();
    if (vw < 768) { return 1; }
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
      window.matchMedia('(max-width: 768px)'),
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
    this.mediaQueryList.forEach(mql => mql.removeListener(this.onBreakpointChange));
  }

  onBreakpointChange() {
    this.setState((prevState) => {
      const gamesToDisplay = CurrentGames.getGamesToDisplay();
      const newOffset = Math.min(prevState.games.length - gamesToDisplay, prevState.currentOffset);
      return { gamesToDisplay, currentOffset: newOffset };
    }, () =>
      this.fetchMoreGamesIfRequired());
  }

  getInitialOffsetBasedOnDate(kickoffs) {
    // TODO calculate initial offset based on current date
    const offsetBasedOnDate = 23;
    return Math.min(offsetBasedOnDate, kickoffs.length - this.state.gamesToDisplay);
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

  fetchKickoffs() {
    fetch(`${API_BASE_URL}/rtg/game-kickoffs/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      if (response.ok) {
        const kickoffs = response.json;
        const initialOffset = this.getInitialOffsetBasedOnDate(kickoffs);
        this.setState(() => ({
          // TODO P1 check if fill is polyfilled on IE
          games: Array(kickoffs.length).fill(null),
          currentOffset: initialOffset,
        }), () => this.fetchMoreGamesIfRequired());
      } else {
        this.setState(() => ({ loadingError: true }));
      }
    }).catch(() => this.setState({ loadingError: true }));
  }

  fetchMoreGamesIfRequired() {
    // TODO only load more when close to the border of the loaded window
    console.log(this.state.games);
    console.log(this.state.currentOffset);
    const desiredOffset = Math.max(0, this.state.currentOffset - this.loadGamesAroundView);
    const desiredLimit = this.state.gamesToDisplay + (2 * this.loadGamesAroundView);
    console.log(`should load offset=${desiredOffset}, limit=${desiredLimit}`);

    let minUnknownGame = -1;
    let maxUnknownGame = -1;
    for (let i = desiredOffset; i < (desiredOffset + desiredLimit); i += 1) {
      if (this.state.games[i] === null) {
        if (minUnknownGame === -1) { minUnknownGame = i; }
        maxUnknownGame = i;
      }
    }

    if (minUnknownGame !== -1) {
      const offset = minUnknownGame;
      const limit = (maxUnknownGame - minUnknownGame) + 1;
      console.log(`actually loading offset=${offset}, limit=${limit}`);
      const gamesUrl = `${API_BASE_URL}/rtg/games/?offset=${offset}&limit=${limit}`;
      this.fetchData(gamesUrl, 'games', true, (prevState, games) =>
        CurrentGames.gamesExcerptResponseToState(prevState, games, offset));
    } else {
      console.log('nothing to reload!');
    }
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

    const scrollButtonStyle = {
      position: 'absolute',
      padding: 0,
      width: SCROLL_BUTTON_SIZE,
      height: SCROLL_BUTTON_SIZE,
      backgroundColor: 'white',
    };
    const scrollButtonIconStyle = {
      width: 0.9 * SCROLL_BUTTON_SIZE,
      height: 0.9 * SCROLL_BUTTON_SIZE,
    };

    return (
      this.state.games ? (
        <section className="CurrentGames">
          {this.canScrollBackward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              tooltip="Zurück"
              tooltipPosition="top-center"
              onClick={this.scrollBackward}
              style={{ left: 0, ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowLeft />
            </IconButton>}
          {this.canScrollForward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              tooltip="Vor"
              tooltipPosition="top-center"
              onClick={this.scrollForward}
              style={{ right: 0, ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowRight />
            </IconButton>}


          {gamesToDisplayWindow.map((offset) => {
            const game = this.state.games[offset];
            return (
              <CurrentGameCard
                key={`current-game-offset-${offset}`}
                game={this.state.games[offset]}
                userBet={game ? this.state.bets.find(bet => bet.bettable === game.id) || {} : null}
              />);
          })}
        </section>) : null);
  }
}

CurrentGames.propTypes = {};

export default CurrentGames;
