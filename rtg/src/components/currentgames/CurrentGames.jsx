import React, { Component } from 'react';
import { IconButton } from 'material-ui';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { viewportW } from 'verge';
import { differenceInMinutes, parse } from 'date-fns';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import CurrentGameCard from './CurrentGameCard';
import { lightGrey, purple } from '../../theme/RtgTheme';
import { debounce } from '../../service/EventsHelper';

import './CurrentGames.css';

const SCROLL_BUTTON_SIZE = 50;

// TODO P3 add "today" button if one scrolls around all games ;-)
// TODO P3 refactor this component!
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
    this.touchStartXPos = -1;

    this.touchEventsOwner = null;
    this.currentGamesRef = React.createRef();

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
    this.horizontalMove = this.horizontalMove.bind(this);
    this.updateTouchMoveToScrollThreshold = this.updateTouchMoveToScrollThreshold.bind(this);
    this.fetchMoreGamesIfRequired = this.fetchMoreGamesIfRequired.bind(this);
    this.mayScrollForward = this.mayScrollForward.bind(this);
    this.mayScrollBackward = this.mayScrollBackward.bind(this);
    this.scrollForward = this.scrollForward.bind(this);
    this.scrollBackward = this.scrollBackward.bind(this);
    this.handleBetEditStart = this.handleBetEditStart.bind(this);
    this.handleBetEditDone = this.handleBetEditDone.bind(this);
  }

  componentDidMount() {
    this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets', false, (prevState, response) => ({ bets: response }));
    this.fetchKickoffs();
    this.registerEvents();
    this.updateTouchMoveToScrollThreshold();
  }

  componentWillUnmount() {
    this.unregisterEvents();
  }

  registerEvents() {
    this.mediaQueryList.forEach(mql => mql.addListener(this.onBreakpointChange));

    this.touchEventsOwner = this.currentGamesRef.current;
    if (this.touchEventsOwner) {
      this.touchEventsOwner.addEventListener('touchstart', this.onTouchStart, false);
      this.touchEventsOwner.addEventListener('touchend', this.onTouchEnd, false);
      this.touchEventsOwner.addEventListener('touchmove', debounce(this.onTouchMove, 10), false);
      this.touchEventsOwner.addEventListener('touchcancel', this.onTouchCancel, false);
    }
  }

  unregisterEvents() {
    this.mediaQueryList.forEach(mql => mql.removeListener(this.onBreakpointChange));

    if (this.touchEventsOwner) {
      this.touchEventsOwner.removeEventListener('touchstart', this.onTouchStart);
      this.touchEventsOwner.removeEventListener('touchend', this.onTouchEnd);
      this.touchEventsOwner.removeEventListener('touchmove', this.onTouchMove);
      this.touchEventsOwner.removeEventListener('touchcancel', this.onTouchCancel);
    }
  }

  onBreakpointChange() {
    this.setState((prevState) => {
      const gamesToDisplay = CurrentGames.getGamesToDisplay();
      const newOffset = Math.min(prevState.games.length - gamesToDisplay, prevState.currentOffset);
      return { gamesToDisplay, currentOffset: newOffset };
    }, () => {
      this.updateTouchMoveToScrollThreshold();
      this.fetchMoreGamesIfRequired();
    });
  }

  onTouchStart(e) {
    this.touchStartXPos = e.changedTouches ? e.changedTouches[0].pageX : null;
  }

  onTouchEnd(e) {
    this.horizontalMove(0);
    if (e.changedTouches && this.touchStartXPos) {
      const movedX = e.changedTouches[0].pageX - this.touchStartXPos;
      if (movedX > this.touchMoveToScrollThreshold) {
        this.scrollBackward();
      } else if (movedX < -this.touchMoveToScrollThreshold) {
        this.scrollForward();
      }
    }
    this.touchStartXPos = null;
  }

  onTouchMove(e) {
    if (e.changedTouches && this.touchStartXPos) {
      const movedX = e.changedTouches[0].pageX - this.touchStartXPos;
      this.horizontalMove(movedX);
    }
  }

  onTouchCancel() {
    this.horizontalMove(0);
    this.touchStartXPos = null;
  }

  horizontalMove(x) {
    if (this.currentGamesRef && this.currentGamesRef.current) {
      const currentGamesClasses = this.currentGamesRef.current.classList;
      if (x === 0) { currentGamesClasses.remove('moving'); }
      else { currentGamesClasses.add('moving'); }
      this.currentGamesRef.current.style.transform = `translateX(${x}px)`;
    }
  }

  updateTouchMoveToScrollThreshold() {
    this.touchMoveToScrollThreshold = 0.5 * (viewportW() / this.state.gamesToDisplay);
  }

  getInitialOffsetBasedOnDate(kickoffs) {
    let offsetBasedOnDate = 0;
    let closestKickoffAbsDifference = Number.MAX_SAFE_INTEGER;
    const now = new Date();
    for (let i = 0; i < kickoffs.length; i += 1) {
      const distance = differenceInMinutes(parse(kickoffs[i]), now);

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

  handleBetEditStart() {
    // TODO P2 only unregister touch events, separate them from media query list events
    // TODO P2 also disable scrolling
    // TODO P2 does not work yet?
    this.unregisterEvents();
  }

  handleBetEditDone(betId, updatedBet, savingReturnType, detail) {
    // TODO P2 update state.bets correctly
    console.log('TODO update bet in CurrentGames state');
    this.registerEvents();
  }

  render() {
    // TODO P2 on scroll, animate scroll first (disable scrolling during animation) and then update state
    // TODO P3 this might not need to be re-evaluated on each re-render,
    // only after scroll and breakpoint change should be enough
    const firstDomElOffset = Math.max(0, this.state.currentOffset - this.state.gamesToDisplay);
    const lastDomElOffset =
      Math.min(this.state.games.length, this.state.currentOffset + (2 * this.state.gamesToDisplay));
    const gamesToDisplayWindow = CurrentGames.range(firstDomElOffset, lastDomElOffset);

    const scrollButtonStyle = {
      position: 'absolute',
      padding: 0,
      width: SCROLL_BUTTON_SIZE,
      height: SCROLL_BUTTON_SIZE,
    };
    const scrollButtonIconStyle = {
      width: 0.9 * SCROLL_BUTTON_SIZE,
      height: 0.9 * SCROLL_BUTTON_SIZE,
    };

    const containerWidthDecimal = gamesToDisplayWindow.length / this.state.gamesToDisplay;
    const containerOffsetDecimal = containerWidthDecimal *
      ((this.state.currentOffset - firstDomElOffset) / gamesToDisplayWindow.length);
    const containerStyle = {
      width: `${100.0 * containerWidthDecimal}%`,
      left: `${-100.0 * containerOffsetDecimal}%`,
    };

    return (
      this.state.games && (
        <section className="CurrentGames">
          {this.mayScrollBackward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              tooltip="Zurück"
              tooltipPosition="top-center"
              onClick={this.scrollBackward}
              style={{ left: 0, marginLeft: '-5px', ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowLeft color={lightGrey} hoverColor={purple} />
            </IconButton>}
          {this.mayScrollForward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              tooltip="Vor"
              tooltipPosition="top-center"
              onClick={this.scrollForward}
              style={{ right: 0, marginRight: '-5px', ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowRight color={lightGrey} hoverColor={purple} />
            </IconButton>}

          <div
            className="CurrentGames__game-card-container"
            ref={this.currentGamesRef}
            style={containerStyle}
          >
            {gamesToDisplayWindow.map((offset) => {
              const game = this.state.games[offset];
              const userBet = game ?
                this.state.bets.find(bet => bet.bettable === game.id) || {} : null;
              return (
                <CurrentGameCard
                  key={`current-game-offset-${offset}`}
                  game={this.state.games[offset]}
                  userBet={userBet}
                  onBetEditStart={this.handleBetEditStart}
                  onBetEditDone={this.handleBetEditDone}
                />);
            })}
          </div>
        </section>));
  }
}

CurrentGames.propTypes = {};

export default CurrentGames;
