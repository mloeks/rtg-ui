import React, { Component } from 'react';
import { IconButton } from 'material-ui';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { viewportW } from 'verge';
import { differenceInMinutes } from 'date-fns';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import CurrentGameCard from './CurrentGameCard';
import { lightGrey, purple } from '../../theme/RtgTheme';

import './CurrentGames.css';

const SCROLL_BUTTON_SIZE = 50;

// TODO P3 add "today" button if one scrolls around all games ;-)
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
    this.loadGamesAroundView = 4;

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.fetchMoreGamesIfRequired = this.fetchMoreGamesIfRequired.bind(this);
    this.mayScrollForward = this.mayScrollForward.bind(this);
    this.mayScrollBackward = this.mayScrollBackward.bind(this);
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
    let offsetBasedOnDate = 0;
    let closestKickoffAbsDifference = Number.MAX_SAFE_INTEGER;
    const now = new Date();
    for (let i = 0; i < kickoffs.length; i += 1) {
      const distance = differenceInMinutes(new Date(kickoffs[i]), now);

      if (distance < 0 && distance > -90) {
        // We found a currently running game. use this and stop immediately. This is important in
        // order to prefer running games over follow-up games which kickoff might be closer.
        offsetBasedOnDate = i;
        break;
      }
      if (Math.abs(distance) >= closestKickoffAbsDifference) {
        // since the kickoffs are ordered chronologically,
        // we can immediately stop if the absolute difference gets larger.
        break;
      }
      closestKickoffAbsDifference = Math.abs(distance);
      offsetBasedOnDate = i;
    }

    if (this.state.gamesToDisplay > 2) {
      // on wider screens, show the current game in the middle,
      // so the previous game is still shown on the left
      offsetBasedOnDate -= 1;
    }
    return Math.max(0, Math.min(offsetBasedOnDate, kickoffs.length - this.state.gamesToDisplay));
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
    // check if we can scroll once more with loaded ames available
    const couldScrollBackwardOnceMore = this.state.games[
      Math.max(0, this.state.currentOffset - this.state.gamesToDisplay)] !== null;
    const couldScrollForwardOnceMore = this.state.games[Math.min(
      this.state.games.length - 1,
      this.state.currentOffset + ((2 * this.state.gamesToDisplay) - 1),
    )] !== null;

    // calculate required window of games to be available
    // increase it, if there would be unavailable games on next scroll
    let desiredOffset = this.state.currentOffset;
    let desiredLimit = this.state.gamesToDisplay;
    if (!couldScrollBackwardOnceMore || !couldScrollForwardOnceMore) {
      desiredOffset = Math.max(0, this.state.currentOffset - this.loadGamesAroundView);
      desiredLimit = this.state.gamesToDisplay + (2 * this.loadGamesAroundView);
    }

    // check available games for desired window
    // note: this is probably unnecessarily through, but we'd like to make
    // sure there are no "gaps" in the games list, e.g. when jumps in the table
    // will happen
    let minUnknownGame = -1;
    let maxUnknownGame = -1;
    for (let i = desiredOffset; i < (desiredOffset + desiredLimit); i += 1) {
      if (this.state.games[i] === null) {
        if (minUnknownGame === -1) { minUnknownGame = i; }
        maxUnknownGame = i;
      }
    }

    // only re-fetch, if there are unloaded games in the desired offset/limit
    if (minUnknownGame !== -1) {
      const offset = minUnknownGame;
      const limit = (maxUnknownGame - minUnknownGame) + 1;
      const gamesUrl = `${API_BASE_URL}/rtg/games/?offset=${offset}&limit=${limit}`;
      this.fetchData(gamesUrl, 'games', true, (prevState, games) =>
        CurrentGames.gamesExcerptResponseToState(prevState, games, offset));
    }
  }

  mayScrollForward() {
    return this.state.currentOffset + this.state.gamesToDisplay < this.state.games.length;
  }

  mayScrollBackward() { return this.state.currentOffset > 0; }

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
    // TODO P2 animate scrolling by rendering more game DOM elements than displayed
    // position to the correct offset with relative left
    // on scroll, animate scroll first (disable scrolling during animation) and then update state
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
          {this.mayScrollBackward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              tooltip="Zurück"
              tooltipPosition="top-center"
              onClick={this.scrollBackward}
              style={{ left: 0, ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowLeft color={lightGrey} hoverColor={purple} />
            </IconButton>}
          {this.mayScrollForward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              tooltip="Vor"
              tooltipPosition="top-center"
              onClick={this.scrollForward}
              style={{ right: 0, ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowRight color={lightGrey} hoverColor={purple} />
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
