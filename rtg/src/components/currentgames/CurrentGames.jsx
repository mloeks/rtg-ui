import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { parseISO } from 'date-fns';

import { withTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { viewportW } from 'verge';
import FetchHelper from '../../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import { UserDetailsContext } from '../providers/UserDetailsProvider';
import CurrentGameCard from './CurrentGameCard';
import { throttle } from '../../service/EventsHelper';
import getClosestGameIndex from '../../service/GamesHelper';
import Notification, { NotificationType } from '../Notification';
import { unsavedChangesConfirmText } from '../../service/BetsUtils';
import BetStatsPanel from '../bets/BetStatsPanel';

import './CurrentGames.scss';

const SCROLL_BUTTON_SIZE = 50;
const MIN_X_OFFSET_TOUCHMOVE = 10;
const MIN_TOUCH_MOVE_TO_SCROLL = 40;

// TODO P2 check if game deadline has passed in the client instead of relying on the
// backend bets_open flag. This way server clock offsets are avoided and the
// UI of running games and the bets stats panel is consistent.
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
    return viewportW() < 1080 ? 1 : 2;
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
    const containerOffsetDecimal = containerWidthDecimal
      * ((offset - windowRange[0]) / windowRange.length);

    return -containerOffsetDecimal;
  }

  static isTouchDisabled(e) {
    return e.target.closest('.BetStatsPanel') !== null;
  }

  constructor(props) {
    super(props);

    this.state = {
      bets: [],
      games: [],
      loadingError: false,

      editingBet: false,
      offsetWithBetStatsOpen: -1,

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

    this.mediaQueryList = [window.matchMedia('(max-width: 1080px)')];
    this.preLoadGamesAroundView = 4;
    this.newOffsetAfterTransition = null;
    this.touchStartXPos = -1;

    this.gamesContainer = null;
    this.currentGamesContainerRef = React.createRef();

    this.confirmNavigationWithUnsavedChanges = this.confirmNavigationWithUnsavedChanges.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.throttledOnTouchMove = throttle(this.onTouchMove.bind(this), 10);
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
    this.fetchData(
      `${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}`,
      'bets', false, (prevState, response) => ({ bets: response }),
    );
    this.fetchKickoffs();
    this.registerEvents();
  }

  componentWillUnmount() {
    this.unregisterEvents();
  }

  handleBetEditDone(betId, newBet, userContext) {
    this.setState((prevState) => {
      const updatedBets = prevState.bets.slice(0);
      const updatedBetIndex = updatedBets.findIndex((bet) => bet.id === betId);
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
    if (e.changedTouches && this.touchStartXPos && !CurrentGames.isTouchDisabled(e)) {
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
    if (e.changedTouches && this.touchStartXPos && !CurrentGames.isTouchDisabled(e)) {
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
    const { scrolling } = this.state;
    if (this.newOffsetAfterTransition !== null && scrolling) {
      this.setState((prevState) => ({
        scrolling: false,
        currentOffset: this.newOffsetAfterTransition,
        gamesToDisplayWindow: CurrentGames
          .getGamesToDisplayWindowState(this.newOffsetAfterTransition, prevState.games.length),
      }), () => {
        this.fetchMoreGamesIfRequired();
        this.newOffsetAfterTransition = null;
        this.horizontalMove(0, false);
      });
    }
  }

  getInitialOffsetBasedOnDate(kickoffDates) {
    const { gamesToDisplay } = this.state;
    let offsetBasedOnDate = getClosestGameIndex(kickoffDates);

    if (gamesToDisplay > 2) {
      // on wider screens, show the current game in the middle,
      // so the previous game is still shown on the left
      offsetBasedOnDate -= 1;
    }
    return Math.max(0, Math.min(offsetBasedOnDate, kickoffDates.length - gamesToDisplay));
  }

  registerEvents() {
    window.addEventListener('beforeunload', this.confirmNavigationWithUnsavedChanges, false);
    this.mediaQueryList.forEach((mql) => mql.addListener(this.onBreakpointChange));

    this.gamesContainer = this.currentGamesContainerRef.current;
    if (this.gamesContainer) {
      this.gamesContainer.addEventListener('touchstart', this.onTouchStart, false);
      this.gamesContainer.addEventListener('touchend', this.onTouchEnd, false);
      this.gamesContainer.addEventListener('touchmove', this.throttledOnTouchMove, false);
      this.gamesContainer.addEventListener('touchcancel', this.onTouchCancel, false);
      this.gamesContainer.addEventListener('transitionend', this.onTransitionEnd, false);
    }
  }

  unregisterEvents() {
    window.removeEventListener('beforeunload', this.confirmNavigationWithUnsavedChanges, false);
    this.mediaQueryList.forEach((mql) => mql.removeListener(this.onBreakpointChange));

    if (this.gamesContainer) {
      this.gamesContainer.removeEventListener('touchstart', this.onTouchStart);
      this.gamesContainer.removeEventListener('touchend', this.onTouchEnd);
      this.gamesContainer.removeEventListener('touchmove', this.throttledOnTouchMove);
      this.gamesContainer.removeEventListener('touchcancel', this.onTouchCancel);
      this.gamesContainer.removeEventListener('transitionend', this.onTransitionEnd);
    }
  }

  confirmNavigationWithUnsavedChanges(e) {
    const { editingBet } = this.state;
    if (editingBet) {
      e.returnValue = unsavedChangesConfirmText;
      return unsavedChangesConfirmText;
    }
    return undefined;
  }

  horizontalMove(x, animate = true) {
    if (this.currentGamesContainerRef && this.currentGamesContainerRef.current) {
      const currentGamesClasses = this.currentGamesContainerRef.current.classList;
      if (animate) {
        currentGamesClasses.remove('no-animate');
      } else {
        currentGamesClasses.add('no-animate');
      }
      this.currentGamesContainerRef.current.style.transform = `translateX(${x}px)`;
    }
  }

  fetchData(url, targetStateField, isPaginated, responseToStateMapper) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      this.setState((prevState) => (response.ok
        ? {
          ...responseToStateMapper(
            prevState,
            isPaginated ? response.json.results : response.json,
          ),
        } : { loadingError: true }
      ));
    }).catch(() => this.setState({ loadingError: true }));
  }

  fetchKickoffs() {
    fetch(`${API_BASE_URL}/rtg/game-kickoffs/`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      if (response.ok) {
        const kickoffDates = response.json.map(parseISO);
        const initialOffset = this.getInitialOffsetBasedOnDate(kickoffDates);
        this.setState(() => ({
          games: Array(kickoffDates.length).fill(null),
          currentOffset: initialOffset,
          gamesToDisplayWindow:
            CurrentGames.getGamesToDisplayWindowState(initialOffset, kickoffDates.length),
        }), () => this.fetchMoreGamesIfRequired());
      } else {
        this.setState(() => ({ loadingError: true }));
      }
    }).catch(() => this.setState({ loadingError: true }));
  }

  fetchMoreGamesIfRequired() {
    const { currentOffset, games, gamesToDisplay } = this.state;

    // check if we can scroll once more with loaded ames available
    const couldScrollBackwardOnceMore = games[
      Math.max(0, currentOffset - gamesToDisplay)] !== null;
    const couldScrollForwardOnceMore = games[
      Math.min(games.length - 1, currentOffset + ((2 * gamesToDisplay) - 1))] !== null;

    // calculate required window of games to be available
    // increase it, if there would be unavailable games on next scroll
    let desiredOffset = currentOffset;
    let desiredLimit = gamesToDisplay;
    if (!couldScrollBackwardOnceMore || !couldScrollForwardOnceMore) {
      desiredOffset = Math.max(0, currentOffset - this.preLoadGamesAroundView);
      desiredLimit = gamesToDisplay + (2 * this.preLoadGamesAroundView);
    }

    // check available games for desired window
    // note: this is probably unnecessarily through, but we'd like to make
    // sure there are no "gaps" in the games list, e.g. when jumps in the table
    // will happen
    let minUnknownGame = -1;
    let maxUnknownGame = -1;
    for (let i = desiredOffset; i < (desiredOffset + desiredLimit); i += 1) {
      if (games[i] === null) {
        if (minUnknownGame === -1) { minUnknownGame = i; }
        maxUnknownGame = i;
      }
    }

    // only re-fetch, if there are unloaded games in the desired offset/limit
    if (minUnknownGame !== -1) {
      const offset = minUnknownGame;
      const limit = (maxUnknownGame - minUnknownGame) + 1;
      const gamesUrl = `${API_BASE_URL}/rtg/games/?offset=${offset}&limit=${limit}`;
      this.fetchData(gamesUrl, 'games', true, (prevState, fetchedGames) => CurrentGames
        .gamesExcerptResponseToState(prevState, fetchedGames, offset));
    }
  }

  mayScrollForward() {
    const {
      currentOffset,
      editingBet,
      games,
      gamesToDisplay,
    } = this.state;

    return !editingBet && currentOffset + gamesToDisplay < games.length;
  }

  mayScrollBackward() {
    const { currentOffset, editingBet } = this.state;
    return !editingBet && currentOffset > 0;
  }

  scrollForward() {
    if (this.mayScrollForward() && this.currentGamesContainerRef
      && this.currentGamesContainerRef.current) {
      this.setState({ scrolling: true, offsetWithBetStatsOpen: -1 }, () => {
        const {
          currentOffset,
          games,
          gamesToDisplay,
          gamesToDisplayWindow,
        } = this.state;

        const nextOffset = currentOffset + gamesToDisplay;
        const maxOffset = games.length - gamesToDisplay;
        this.newOffsetAfterTransition = Math.min(nextOffset, maxOffset);

        const windowRange = gamesToDisplayWindow.range;
        const numberOfGamesToTheRight = windowRange[windowRange.length - 1] - (nextOffset - 1);
        const relativeTranslateForForwardScroll = -numberOfGamesToTheRight / windowRange.length;
        this.currentGamesContainerRef.current
          .style.transform = `translateX(${100.0 * relativeTranslateForForwardScroll}%)`;
      });
    } else {
      this.horizontalMove(0);
    }
  }

  scrollBackward() {
    if (this.mayScrollBackward() && this.currentGamesContainerRef
      && this.currentGamesContainerRef.current) {
      this.setState({ scrolling: true, offsetWithBetStatsOpen: -1 }, () => {
        const { currentOffset, gamesToDisplay, gamesToDisplayWindow } = this.state;
        this.newOffsetAfterTransition = Math.max(currentOffset - gamesToDisplay, 0);

        const windowRange = gamesToDisplayWindow.range;
        const numberOfGamesToTheLeft = currentOffset - windowRange[0];
        const relativeTranslateForBackwardScroll = numberOfGamesToTheLeft / windowRange.length;
        this.currentGamesContainerRef.current
          .style.transform = `translateX(${100.0 * relativeTranslateForBackwardScroll}%)`;
      });
    } else {
      this.horizontalMove(0);
    }
  }

  render() {
    const {
      bets,
      editingBet,
      games,
      gamesToDisplayWindow,
      loadingError,
      offsetWithBetStatsOpen,
      scrolling,
    } = this.state;
    const { theme } = this.props;

    const scrollButtonStyle = {
      position: 'absolute',
      padding: 0,
      width: SCROLL_BUTTON_SIZE,
      height: SCROLL_BUTTON_SIZE,
      fontSize: SCROLL_BUTTON_SIZE,
      color: theme.palette.grey['400'],
    };

    if (loadingError) {
      return (
        <Notification
          type={NotificationType.ERROR}
          title="Fehler beim Laden der aktuellen Spiele"
          subtitle="Bitte versuche es erneut."
          containerStyle={{ margin: '30px auto', maxWidth: 480 }}
        />
      );
    }

    return (
      games && (
        <section className={`CurrentGames ${offsetWithBetStatsOpen !== -1 ? 'bet-stats-open' : ''}`}>
          <h4>Aktuelle Spiele</h4>
          <Prompt
            when={editingBet}
            message={unsavedChangesConfirmText}
          />

          {this.mayScrollBackward() && (
            <IconButton
              className="CurrentGames__scroll-button"
              disabled={scrolling}
              onClick={this.scrollBackward}
              style={{ left: 0, margin: '4px 0 0 -5px', ...scrollButtonStyle }}
            >
              <KeyboardArrowLeftIcon color="inherit" fontSize="inherit" />
            </IconButton>
          )}
          {this.mayScrollForward() && (
            <IconButton
              className="CurrentGames__scroll-button"
              disabled={scrolling}
              onClick={this.scrollForward}
              style={{ right: 0, margin: '4px -5px 0 0', ...scrollButtonStyle }}
            >
              <KeyboardArrowRightIcon color="inherit" fontSize="inherit" />
            </IconButton>
          )}

          <UserDetailsContext.Consumer>
            {(userContext) => (
              <div
                className={`CurrentGames__game-card-container ${scrolling ? 'scrolling' : ''}`}
                ref={this.currentGamesContainerRef}
                style={{
                  left: `${100.0 * gamesToDisplayWindow.containerStyle.left}%`,
                  width: `${100.0 * gamesToDisplayWindow.containerStyle.width}%`,
                }}
              >
                {gamesToDisplayWindow.range.map((offset) => {
                  const game = games[offset];
                  const userBet = game ? bets.find((bet) => bet.bettable === game.id) : null;
                  return (
                    <div
                      className="CurrentGames__game-card-wrapper"
                      key={`current-game-offset-${offset}`}
                    >
                      <CurrentGameCard
                        game={games[offset]}
                        userBet={userBet}
                        onBetEditStart={() => this.setState({ editingBet: true })}
                        onBetEditCancel={() => this.setState({ editingBet: false })}
                        onBetEditDone={(id, bet) => this.handleBetEditDone(id, bet, userContext)}
                      />
                      {(game && !game.bets_open && offset !== null) && (
                        <BetStatsPanel
                          bettableId={game.id}
                          open={offset === offsetWithBetStatsOpen}
                          onClose={() => this.setState({ offsetWithBetStatsOpen: -1 })}
                          onOpen={() => this.setState({ offsetWithBetStatsOpen: offset })}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </UserDetailsContext.Consumer>
        </section>
      ));
  }
}

CurrentGames.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(CurrentGames);
