import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import { IconButton } from 'material-ui';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { viewportW } from 'verge';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import { UserDetailsContext } from '../providers/UserDetailsProvider';
import CurrentGameCard from './CurrentGameCard';
import { lightGrey, purple } from '../../theme/RtgTheme';
import { debounce } from '../../service/EventsHelper';
import { getClosestGameIndex } from '../../service/GamesHelper';
import Notification, { NotificationType } from '../Notification';
import { unsavedChangesConfirmText } from '../../pages/Bets';

import './CurrentGames.css';

const SCROLL_BUTTON_SIZE = 50;
const MIN_X_OFFSET_TOUCHMOVE = 10;
const MIN_TOUCH_MOVE_TO_SCROLL = 100;

// TODO P3 add "today" button if one scrolls around all games ;-)
// TODO P3 refactor this component, e.g. move game container into its own component with
// all event handling etc. attached
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

  static getGamesToDisplayWindowState(offset, totalGames) {
    const gamesToDisplay = CurrentGames.getGamesToDisplay();
    const firstDomElOffset = Math.max(0, offset - gamesToDisplay);
    const lastDomElOffset = Math.min(totalGames, offset + (2 * gamesToDisplay));
    const range = CurrentGames.range(firstDomElOffset, lastDomElOffset);

    return {
      range,
      containerStyle: {
        width: range.length / gamesToDisplay,
        left: CurrentGames.getContainerLeftValueForOffset(offset, range, gamesToDisplay),
      },
    };
  }

  // calculate the CSS 'left' property for the correct absolute positioning of the games "window"
  static getContainerLeftValueForOffset(offset, windowRange, displayedGamesCount) {
    const gamesToDisplay = displayedGamesCount || CurrentGames.getGamesToDisplay();
    const containerWidthDecimal = windowRange.length / gamesToDisplay;
    const containerOffsetDecimal = containerWidthDecimal *
      ((offset - windowRange[0]) / windowRange.length);

    return -containerOffsetDecimal;
  }

  constructor(props) {
    super(props);

    this.state = {
      bets: [],
      games: [],
      loadingError: false,

      editingBet: false,

      currentOffset: 0,
      gamesToDisplay: CurrentGames.getGamesToDisplay(),
      scrolling: false,

      // the DOM contains more current games than visible in the viewport,
      // in order to offer a nice animated scrolling (especially on touch devices)
      // This state field contains the offsets currently in the DOM
      // and the dynamic styling of the container div (required for animating properly
      // on scroll and touchmove)
      gamesToDisplayWindow: {
        range: [],
        // relative CSS props, but in decimal values! converted to % in render function
        containerStyle: {},
      },
    };

    this.mediaQueryList = [
      window.matchMedia('(max-width: 768px)'),
      window.matchMedia('(max-width: 1280px)'),
    ];
    this.preLoadGamesAroundView = 4;
    this.newOffsetAfterTransition = null;
    this.touchStartXPos = -1;

    this.gamesContainer = null;
    this.currentGamesContainerRef = React.createRef();

    this.confirmNavigationWithUnsavedChanges = this.confirmNavigationWithUnsavedChanges.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.horizontalMove = this.horizontalMove.bind(this);
    this.fetchMoreGamesIfRequired = this.fetchMoreGamesIfRequired.bind(this);
    this.mayScrollForward = this.mayScrollForward.bind(this);
    this.mayScrollBackward = this.mayScrollBackward.bind(this);
    this.scrollForward = this.scrollForward.bind(this);
    this.scrollBackward = this.scrollBackward.bind(this);
    this.handleBetEditDone = this.handleBetEditDone.bind(this);
  }

  componentDidMount() {
    this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets', false, (prevState, response) => ({ bets: response }));
    this.fetchKickoffs();
    this.registerEvents();
  }

  componentWillUnmount() {
    this.unregisterEvents();
  }

  registerEvents() {
    window.addEventListener('beforeunload', this.confirmNavigationWithUnsavedChanges, false);
    this.mediaQueryList.forEach(mql => mql.addListener(this.onBreakpointChange));

    this.gamesContainer = this.currentGamesContainerRef.current;
    if (this.gamesContainer) {
      this.gamesContainer.addEventListener('touchstart', this.onTouchStart, false);
      this.gamesContainer.addEventListener('touchend', this.onTouchEnd, false);
      this.gamesContainer.addEventListener('touchmove', debounce(this.onTouchMove, 10), false);
      this.gamesContainer.addEventListener('touchcancel', this.onTouchCancel, false);
      this.gamesContainer.addEventListener('transitionend', this.onTransitionEnd, false);
    }
  }

  unregisterEvents() {
    window.removeEventListener('beforeunload', this.confirmNavigationWithUnsavedChanges, false);
    this.mediaQueryList.forEach(mql => mql.removeListener(this.onBreakpointChange));

    if (this.gamesContainer) {
      this.gamesContainer.removeEventListener('touchstart', this.onTouchStart);
      this.gamesContainer.removeEventListener('touchend', this.onTouchEnd);
      this.gamesContainer.removeEventListener('touchmove', this.onTouchMove);
      this.gamesContainer.removeEventListener('touchcancel', this.onTouchCancel);
      this.gamesContainer.removeEventListener('transitionend', this.onTransitionEnd);
    }
  }

  confirmNavigationWithUnsavedChanges(e) {
    if (this.state.editingBet) {
      e.returnValue = unsavedChangesConfirmText;
      return unsavedChangesConfirmText;
    }
    return undefined;
  }

  onBreakpointChange() {
    this.setState((prevState) => {
      const gamesToDisplay = CurrentGames.getGamesToDisplay();
      const newOffset = Math.min(prevState.games.length - gamesToDisplay, prevState.currentOffset);
      return {
        gamesToDisplay,
        currentOffset: newOffset,
        gamesToDisplayWindow:
          CurrentGames.getGamesToDisplayWindowState(newOffset, prevState.games.length),
      };
    }, this.fetchMoreGamesIfRequired);
  }

  onTouchStart(e) {
    this.touchStartXPos = e.changedTouches ? e.changedTouches[0].pageX : null;
  }

  onTouchEnd(e) {
    if (e.changedTouches && this.touchStartXPos) {
      const movedX = e.changedTouches[0].pageX - this.touchStartXPos;
      if (movedX > MIN_TOUCH_MOVE_TO_SCROLL) {
        this.scrollBackward();
      } else if (movedX < -MIN_TOUCH_MOVE_TO_SCROLL) {
        this.scrollForward();
      } else {
        this.horizontalMove(0);
      }
    }
    this.touchStartXPos = null;
  }

  onTouchMove(e) {
    if (e.changedTouches && this.touchStartXPos) {
      const movedX = e.changedTouches[0].pageX - this.touchStartXPos;
      if (Math.abs(movedX) > MIN_X_OFFSET_TOUCHMOVE) {
        this.horizontalMove(movedX, false);
      }
    }
  }

  onTouchCancel() {
    this.horizontalMove(0);
    this.touchStartXPos = null;
  }

  onTransitionEnd() {
    if (this.newOffsetAfterTransition !== null && this.state.scrolling) {
      this.setState(prevState => ({
        scrolling: false,
        currentOffset: this.newOffsetAfterTransition,
        gamesToDisplayWindow:
          CurrentGames.getGamesToDisplayWindowState(this.newOffsetAfterTransition, prevState.games.length),
      }), () => {
        this.fetchMoreGamesIfRequired();
        this.newOffsetAfterTransition = null;
        this.horizontalMove(0, false);
      });
    }
  }

  horizontalMove(x, animate = true) {
    if (this.currentGamesContainerRef && this.currentGamesContainerRef.current) {
      const currentGamesClasses = this.currentGamesContainerRef.current.classList;
      if (animate) { currentGamesClasses.remove('no-animate'); }
      else { currentGamesClasses.add('no-animate'); }
      this.currentGamesContainerRef.current.style.transform = `translateX(${x}px)`;
    }
  }

  getInitialOffsetBasedOnDate(kickoffs) {
    let offsetBasedOnDate = getClosestGameIndex(kickoffs);

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
          gamesToDisplayWindow:
            CurrentGames.getGamesToDisplayWindowState(initialOffset, kickoffs.length),
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
      desiredOffset = Math.max(0, this.state.currentOffset - this.preLoadGamesAroundView);
      desiredLimit = this.state.gamesToDisplay + (2 * this.preLoadGamesAroundView);
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
    return !this.state.editingBet &&
      this.state.currentOffset + this.state.gamesToDisplay < this.state.games.length;
  }

  mayScrollBackward() {
    return !this.state.editingBet && this.state.currentOffset > 0;
  }

  scrollForward() {
    if (this.mayScrollForward() &&
      this.currentGamesContainerRef && this.currentGamesContainerRef.current) {
      this.setState({ scrolling: true }, () => {
        const nextOffset = this.state.currentOffset + this.state.gamesToDisplay;
        const maxOffset = this.state.games.length - this.state.gamesToDisplay;
        this.newOffsetAfterTransition = Math.min(nextOffset, maxOffset);

        const windowRange = this.state.gamesToDisplayWindow.range;
        const numberOfGamesToTheRight = windowRange[windowRange.length - 1] - (nextOffset - 1);
        const relativeTranslateForForwardScroll = -numberOfGamesToTheRight / windowRange.length;
        this.currentGamesContainerRef.current.style.transform =
          `translateX(${100.0 * relativeTranslateForForwardScroll}%)`;
      });
    } else {
      this.horizontalMove(0);
    }
  }

  scrollBackward() {
    if (this.mayScrollBackward() &&
      this.currentGamesContainerRef && this.currentGamesContainerRef.current) {
      this.setState({ scrolling: true }, () => {
        this.newOffsetAfterTransition =
          Math.max(this.state.currentOffset - this.state.gamesToDisplay, 0);

        const windowRange = this.state.gamesToDisplayWindow.range;
        const numberOfGamesToTheLeft = this.state.currentOffset - windowRange[0];
        const relativeTranslateForBackwardScroll = numberOfGamesToTheLeft / windowRange.length;
        this.currentGamesContainerRef.current.style.transform =
          `translateX(${100.0 * relativeTranslateForBackwardScroll}%)`;
      });
    } else {
      this.horizontalMove(0);
    }
  }

  handleBetEditDone(betId, newBet, userContext) {
    this.setState((prevState) => {
      const updatedBets = prevState.bets.slice(0);
      const updatedBetIndex = updatedBets.findIndex(bet => bet.id === betId);
      if (updatedBetIndex !== -1) {
        if (newBet) {
          updatedBets[updatedBetIndex] = newBet;
        } else {
          // remove bet from bets array
          updatedBets.splice(updatedBetIndex, 1);
          userContext.updateOpenBetsCount(userContext.openBetsCount + 1);
        }
      } else if (newBet) {
        updatedBets.push(newBet);
        userContext.updateOpenBetsCount(userContext.openBetsCount - 1);
      }
      return { bets: updatedBets, editingBet: false };
    });
  }

  render() {
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

    if (this.state.loadingError) {
      return (
        <Notification
          type={NotificationType.ERROR}
          title="Fehler beim Laden der aktuellen Spiele"
          subtitle="Bitte versuche es erneut."
          containerStyle={{ margin: '30px auto', maxWidth: 480 }}
        />);
    }

    return (
      this.state.games && (
        <section className="CurrentGames">
          <Prompt
            when={this.state.editingBet}
            message={unsavedChangesConfirmText}
          />

          {this.mayScrollBackward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              disabled={this.state.scrolling}
              onClick={this.scrollBackward}
              style={{ left: 0, marginLeft: '-5px', ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowLeft color={lightGrey} hoverColor={purple} />
            </IconButton>}
          {this.mayScrollForward() &&
            <IconButton
              className="CurrentGames__scroll-button"
              disabled={this.state.scrolling}
              onClick={this.scrollForward}
              style={{ right: 0, marginRight: '-5px', ...scrollButtonStyle }}
              iconStyle={scrollButtonIconStyle}
            ><HardwareKeyboardArrowRight color={lightGrey} hoverColor={purple} />
            </IconButton>}

          <UserDetailsContext.Consumer>
            {userContext => (
              <div
                className={`CurrentGames__game-card-container ${this.state.scrolling ? 'scrolling' : ''}`}
                ref={this.currentGamesContainerRef}
                style={{
                  left: `${100.0 * this.state.gamesToDisplayWindow.containerStyle.left}%`,
                  width: `${100.0 * this.state.gamesToDisplayWindow.containerStyle.width}%`,
                }}
              >
                {this.state.gamesToDisplayWindow.range.map((offset) => {
                  const game = this.state.games[offset];
                  const userBet = game ?
                    this.state.bets.find(bet => bet.bettable === game.id) : null;
                  return (
                    <CurrentGameCard
                      key={`current-game-offset-${offset}`}
                      game={this.state.games[offset]}
                      userBet={userBet}
                      onBetEditStart={() => this.setState({ editingBet: true })}
                      onBetEditCancel={() => this.setState({ editingBet: false })}
                      onBetEditDone={(id, bet) => this.handleBetEditDone(id, bet, userContext)}
                    />);
                })}
              </div>
            )}
          </UserDetailsContext.Consumer>
        </section>));
  }
}

CurrentGames.propTypes = {};

export default CurrentGames;
