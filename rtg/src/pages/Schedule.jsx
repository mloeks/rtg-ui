import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import stickybits from 'stickybits';
import { Divider, DropDownMenu, FloatingActionButton, MenuItem } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons/index';
import AvNotInterested from 'material-ui/svg-icons/av/not-interested';
import { format, isSameDay, parse } from 'date-fns';
import de from 'date-fns/locale/de';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import GameCard from '../components/GameCard';
import NullGameCard from '../components/NullGameCard';
import RtgSeparator from '../components/RtgSeparator';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import Notification, { NotificationType } from '../components/Notification';
import GameCardGameInfo from '../components/GameCardGameInfo';
import { isEnter } from '../service/KeyHelper';
import { getClosestGameIndex } from '../service/GamesHelper';
import BetStatsPanel from '../components/bets/BetStatsPanel';
import AddGameForm from '../components/schedule/AddPostForm';
import { darkGrey, lightGrey, white } from '../theme/RtgTheme';

import './Schedule.css';
import headingImg from '../theme/img/headings/cup_and_ball.jpg';

const DEFAULT_ROUND_INDEX = 'VOR';

// TODO P2 add possibility to add games for admins
class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRoundIndex: DEFAULT_ROUND_INDEX,
      selectedGroupFilter: 'all',
      games: [],
      rounds: [],
      groups: [],
      bets: [],
      gameIdWithBetStatsOpen: -1,

      addingGame: true,
      addGameSuccess: false,

      loading: true,
      loadingError: '',
    };
    this.stickybitsInstance = null;
    this.gamesSectionRef = React.createRef();

    this.selectCurrentRound = this.selectCurrentRound.bind(this);
    this.handleSelectedRoundChange = this.handleSelectedRoundChange.bind(this);
    this.handleGroupFilterChanged = this.handleGroupFilterChanged.bind(this);
    this.handleAddGame = this.handleAddGame.bind(this);
    this.handleGameSaved = this.handleGameSaved.bind(this);
    this.handleAddGameCancelled = this.handleAddGameCancelled.bind(this);
    this.gamesFilter = this.gamesFilter.bind(this);
  }

  async componentDidMount() {
    this.stickybitsInstance = stickybits('.SchedulePage__toolbar');

    await this.fetchData(`${API_BASE_URL}/rtg/tournamentrounds/`, 'rounds', false);
    await this.fetchData(`${API_BASE_URL}/rtg/tournamentgroups/`, 'groups', false);
    await this.fetchData(`${API_BASE_URL}/rtg/games/?limit=999`, 'games', true, this.selectCurrentRound);
    await this.fetchData(`${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}`, 'bets', false);

    this.setState({ loading: false });
  }

  componentDidUpdate() {
    if (this.stickybitsInstance) {
      this.stickybitsInstance.update();
    }
  }

  componentWillUnmount() {
    if (this.stickybitsInstance) {
      this.stickybitsInstance.cleanup();
    }
  }

  async fetchData(url, targetStateField, isPaginated, successCallback = () => {}) {
    this.setState({ loadingError: '' });
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? { [targetStateField]: isPaginated ? response.json.results : response.json }
            : { loadingError: true }
        ), successCallback);
      }).catch(() => this.setState({ loadingError: true }));
  }

  selectCurrentRound() {
    const closestGameIndex = getClosestGameIndex(this.state.games.map(g => g.kickoff));
    this.setState({
      selectedRoundIndex: closestGameIndex !== -1 ?
        this.state.games[closestGameIndex].round_details.abbreviation :
        DEFAULT_ROUND_INDEX,
    });
  }

  handleSelectedRoundChange(event, index, value) {
    this.setState({ selectedRoundIndex: value });
  }

  handleGroupFilterChanged(event, index, value) {
    this.setState({ selectedGroupFilter: value });
  }

  handleAddGame() {
    // TODO P3 animated scroll (lib?)
    this.setState({ addingGame: true, addGameSuccess: false }, () => {
      const addGameTopYPos = (window.pageYOffset +
        this.gamesSectionRef.current.getBoundingClientRect().top) - 150;
      window.scrollTo(0, addGameTopYPos);
    });
  }

  handleGameSaved(newGame) {
    this.setState((prevState) => {
      const newGames = prevState.games.slice(0);
      newGames.unshift(newGame);

      return {
        games: newGames,
        addingGame: false,
        addGameSuccess: true,
      };
    });
  }

  handleAddGameCancelled() {
    this.setState({ addingGame: false, addGameSuccess: false });
  }

  gamesFilter(game) {
    if (this.state.selectedRoundIndex === 'VOR' && this.state.selectedGroupFilter !== 'all') {
      return game.group && game.group.abbreviation === this.state.selectedGroupFilter;
    }
    return game.round_details.abbreviation === this.state.selectedRoundIndex;
  }

  createGameCardsWithDateSubheadings(games, bets) {
    const gameCardsWithDateSubheadings = [];
    let lastGameDay = null;
    games.forEach((game) => {
      if (lastGameDay === null || !isSameDay(game.kickoff, lastGameDay)) {
        gameCardsWithDateSubheadings
          .push(<RtgSeparator
            key={game.kickoff}
            content={format(parse(game.kickoff), 'dddd D. MMMM', { locale: de })}
            style={{ margin: '15px auto' }}
          />);
        lastGameDay = game.kickoff;
      }
      const userBet = bets.find(bet => bet.bettable === game.id) || {};
      gameCardsWithDateSubheadings.push(
        <Fragment key={`game-card-${game.id}`}>
          <div
            role="button"
            className="GameCard__click-wrapper"
            tabIndex={0}
            onClick={() => this.props.history.push('/bets')}
            onKeyPress={e => (isEnter(e) && this.props.history.push('/bets'))}
          >
            <GameCard userBet={userBet} style={{ marginBottom: 25 }} {...game}>
              <GameCardGameInfo
                city={game.city}
                kickoff={parse(game.kickoff)}
                result={game.homegoals !== -1 && game.awaygoals !== -1 ? `${game.homegoals} : ${game.awaygoals}` : null}
                resultBetType={userBet.result_bet_type}
                points={userBet.points}
                userBet={userBet.result_bet}
              />
            </GameCard>
          </div>
          {(game && !game.bets_open) &&
            <BetStatsPanel
              bettableId={game.id}
              open={game.id === this.state.gameIdWithBetStatsOpen}
              onClose={() => this.setState({ gameIdWithBetStatsOpen: -1 })}
              onOpen={() => this.setState({ gameIdWithBetStatsOpen: game.id })}
              style={{ marginTop: -30, maxWidth: 580 }}
              buttonStyle={{ color: lightGrey }}
            />}
        </Fragment>,
      );
    });
    return gameCardsWithDateSubheadings;
  }

  render() {
    if (this.stickybitsInstance) {
      this.stickybitsInstance.update();
    }

    const gamesToDisplay = this.state.games.filter(this.gamesFilter);
    const gameContainerItems =
      this.createGameCardsWithDateSubheadings(gamesToDisplay, this.state.bets);

    return (
      <Page className="SchedulePage">
        <BigPicture className="SchedulePage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Spielplan</h1>
        </BigPicture>

        <section className="SchedulePage__content" ref={this.gamesSectionRef}>
          <section
            id="schedule-toolbar"
            className="SchedulePage__toolbar"
            style={{ color: white, backgroundColor: darkGrey }}
          >
            <div className="SchedulePage__toolbar-title">Spiele wählen</div>
            <DropDownMenu
              className="SchedulePage__toolbar-dropdown"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              value={this.state.selectedRoundIndex}
              onChange={this.handleSelectedRoundChange}
              labelStyle={{ color: white }}
            >
              {this.state.rounds.map(round => (
                <MenuItem
                  key={round.id}
                  checked={this.state.selectedRoundIndex === round.abbreviation}
                  insetChildren
                  value={round.abbreviation}
                  primaryText={round.name}
                  style={{ textAlign: 'left' }}
                />))
              }
            </DropDownMenu>
            {this.state.selectedRoundIndex === 'VOR' &&
            <DropDownMenu
              className="SchedulePage__toolbar-dropdown"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              value={this.state.selectedGroupFilter}
              onChange={this.handleGroupFilterChanged}
              labelStyle={{ color: white }}
            >
              <MenuItem
                checked={this.state.selectedGroupFilter === 'all'}
                insetChildren
                primaryText="Alle Gruppen"
                value="all"
                style={{ textAlign: 'left' }}
              />
              <Divider />
              {this.state.groups.map(group => (
                <MenuItem
                  key={group.abbreviation}
                  checked={this.state.selectedGroupFilter === group.abbreviation}
                  insetChildren
                  primaryText={group.name}
                  value={group.abbreviation}
                  style={{ textAlign: 'left' }}
                />))
              }
            </DropDownMenu>}
          </section>

          {(AuthService.isAdmin() && this.state.addingGame) &&
            <AddGameForm
              onSaved={this.handleGameSaved}
              onCancelled={this.handleAddGameCancelled}
            />}
          {(AuthService.isAdmin() && this.state.addGameSuccess) &&
            <Notification
              type={NotificationType.SUCCESS}
              title="Spiel erfolgreich hinzugefügt"
              disappearAfterMs={3000}
            />}

          <section className="SchedulePage__game-container">
            {(!this.state.loading && !this.state.loadingError) && gameContainerItems}

            {(!this.state.loading && !this.state.loadingError && gamesToDisplay.length === 0) &&
              <div className="SchedulePage__empty-state" style={{ color: lightGrey }}>
                <AvNotInterested
                  color={lightGrey}
                  style={{ height: 80, width: 80, marginBottom: 10 }}
                /><br />Keine Spiele vorhanden.
              </div>}

            {this.state.loading &&
              <Fragment>
                <RtgSeparator content="..." />
                {Array(3).fill('').map((v, i) => <NullGameCard key={`game-placeholder-${i}`} />)}
              </Fragment>}

            {this.state.loadingError &&
              <Notification
                type={NotificationType.ERROR}
                title="Fehler beim Laden"
                subtitle="Bitte versuche es erneut."
              />
            }

            {(AuthService.isAdmin() && !this.state.addingGame) &&
              <div className="SchedulePage__add-game-button">
                <FloatingActionButton onClick={this.handleAddGame}>
                  <ContentAdd />
                </FloatingActionButton>
              </div>}
          </section>
        </section>
      </Page>);
  }
}

Schedule.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default withRouter(Schedule);
