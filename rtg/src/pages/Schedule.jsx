import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterProptypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { withTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import AddIcon from '@material-ui/icons/Add';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { format, isSameDay, parseISO } from 'date-fns';
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
import isEnter from '../service/KeyHelper';
import getClosestGameIndex from '../service/GamesHelper';
import BetStatsPanel from '../components/bets/BetStatsPanel';
import AddGameForm from '../components/schedule/AddGameForm';

import './Schedule.scss';
import headingImg from '../theme/img/headings/cup_and_ball.jpg';

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRoundIndex: '',
      selectedGroupFilter: 'all',
      games: [],
      rounds: [],
      groups: [],
      bets: [],
      gameIdWithBetStatsOpen: -1,

      addingGame: false,
      addGameSuccess: false,

      loading: true,
      loadingError: '',
    };
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
    await this.fetchData(`${API_BASE_URL}/rtg/tournamentrounds/`, 'rounds', false);
    await this.fetchData(`${API_BASE_URL}/rtg/tournamentgroups/`, 'groups', false);
    await this.fetchData(`${API_BASE_URL}/rtg/games/?limit=999`, 'games', true, this.selectCurrentRound);
    await this.fetchData(`${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}`, 'bets', false);

    this.setState({ loading: false });
  }

  handleSelectedRoundChange(e) {
    this.setState({ selectedRoundIndex: e.target.value });
  }

  handleGroupFilterChanged(e) {
    this.setState({ selectedGroupFilter: e.target.value });
  }

  handleAddGame() {
    // TODO P3 animated scroll (lib?)
    this.setState({ addingGame: true, addGameSuccess: false }, () => {
      const addGameTopYPos = (window.pageYOffset
        + this.gamesSectionRef.current.getBoundingClientRect().top) - 150;
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
        selectedRoundIndex: newGame.round_details.abbreviation,
      };
    });
  }

  handleAddGameCancelled() {
    this.setState({ addingGame: false, addGameSuccess: false });
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
    const { games } = this.state;
    const closestGameIndex = getClosestGameIndex(games.map((g) => parseISO(g.kickoff)));
    this.setState({
      selectedRoundIndex: closestGameIndex !== -1
        ? games[closestGameIndex].round_details.abbreviation
        : 'VOR',
    });
  }

  gamesFilter(game) {
    const { selectedGroupFilter, selectedRoundIndex } = this.state;
    if (selectedRoundIndex === 'VOR' && selectedGroupFilter !== 'all') {
      return game.group && game.group.abbreviation === selectedGroupFilter;
    }
    return game.round_details.abbreviation === selectedRoundIndex;
  }

  createGameCardsWithDateSubheadings(games, bets) {
    const { gameIdWithBetStatsOpen } = this.state;
    const { history, theme } = this.props;

    const gameCardsWithDateSubheadings = [];
    let lastGameDay = null;
    games.forEach((game) => {
      const gameKickoffDate = parseISO(game.kickoff);
      if (lastGameDay === null || !isSameDay(gameKickoffDate, lastGameDay)) {
        gameCardsWithDateSubheadings
          .push(<RtgSeparator
            key={game.kickoff}
            content={format(gameKickoffDate, 'EEEE d. MMMM', { locale: de })}
            style={{ margin: '15px auto' }}
          />);
        lastGameDay = gameKickoffDate;
      }
      const userBet = bets.find((bet) => bet.bettable === game.id) || {};
      gameCardsWithDateSubheadings.push(
        <React.Fragment key={`game-card-${game.id}`}>
          <div
            role="button"
            className="GameCard__click-wrapper"
            tabIndex={0}
            onClick={() => history.push('/bets')}
            onKeyPress={(e) => (isEnter(e) && history.push('/bets'))}
          >
            <GameCard
              style={{ marginBottom: 25 }}
              hometeam={game.hometeam_name}
              hometeamAbbrev={game.hometeam_abbreviation}
              awayteam={game.awayteam_name}
              awayteamAbbrev={game.awayteam_abbreviation}
            >
              <GameCardGameInfo
                city={game.city}
                kickoff={gameKickoffDate}
                result={game.homegoals !== -1 && game.awaygoals !== -1 ? `${game.homegoals} : ${game.awaygoals}` : null}
                resultBetType={userBet.result_bet_type}
                points={userBet.points}
                userBet={userBet.result_bet}
              />
            </GameCard>
          </div>
          {(game && !game.bets_open) && (
            <BetStatsPanel
              bettableId={game.id}
              open={game.id === gameIdWithBetStatsOpen}
              onClose={() => this.setState({ gameIdWithBetStatsOpen: -1 })}
              onOpen={() => this.setState({ gameIdWithBetStatsOpen: game.id })}
              style={{ marginTop: -30, maxWidth: 580 }}
              buttonStyle={{ color: theme.palette.grey['500'] }}
            />
          )}
        </React.Fragment>,
      );
    });
    return gameCardsWithDateSubheadings;
  }

  render() {
    const {
      addGameSuccess,
      addingGame,
      bets,
      loading,
      loadingError,
      games,
      groups,
      rounds,
      selectedGroupFilter,
      selectedRoundIndex,
    } = this.state;
    const { theme } = this.props;

    const gamesToDisplay = games.filter(this.gamesFilter);
    const gameContainerItems = this.createGameCardsWithDateSubheadings(gamesToDisplay, bets);

    return (
      <Page className="SchedulePage">
        <BigPicture className="SchedulePage__heading" img={headingImg}>
          <h2 className="BigPicture__heading">Spielplan</h2>
        </BigPicture>

        <section className="SchedulePage__content" ref={this.gamesSectionRef}>
          <section
            id="schedule-toolbar"
            className="SchedulePage__toolbar"
            style={{ backgroundColor: theme.palette.common.white }}
          >
            <div className="SchedulePage__toolbar-title">Spiele wählen:</div>
            <FormControl style={{ margin: 8 }}>
              <InputLabel htmlFor="round">Runde</InputLabel>
              <Select
                value={selectedRoundIndex}
                onChange={this.handleSelectedRoundChange}
                input={<Input name="round" id="round" />}
              >
                {rounds.map((round) => (
                  <MenuItem key={round.id} value={round.abbreviation}>{round.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRoundIndex === 'VOR' && (
              <FormControl style={{ margin: 8 }}>
                <InputLabel htmlFor="group">Gruppe</InputLabel>
                <Select
                  value={selectedGroupFilter}
                  onChange={this.handleGroupFilterChanged}
                  input={<Input name="group" id="group" />}
                >
                  <MenuItem value="all">Alle</MenuItem>
                  <Divider />
                  {groups.map((group) => (
                    <MenuItem key={group.abbreviation} value={group.abbreviation}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </section>

          {(AuthService.isAdmin() && addingGame) && (
            <AddGameForm
              onSaved={this.handleGameSaved}
              onCancelled={this.handleAddGameCancelled}
            />
          )}
          {(AuthService.isAdmin() && addGameSuccess) && (
            <Notification
              type={NotificationType.SUCCESS}
              title="Spiel erfolgreich hinzugefügt"
              disappearAfterMs={3000}
            />
          )}

          <section className="SchedulePage__game-container">
            {(!loading && !loadingError) && gameContainerItems}
            {(!loading && !loadingError && gamesToDisplay.length === 0) && (
              <div
                className="SchedulePage__empty-state"
                style={{ color: theme.palette.grey['500'] }}
              >
                <NotInterestedIcon
                  color="inherit"
                  style={{ height: 80, width: 80, marginBottom: 10 }}
                />
                <br />
                Keine Spiele vorhanden.
              </div>
            )}

            {loading && (
              <>
                <RtgSeparator content="..." />
                {Array(3).fill('').map((_v, i) => <NullGameCard key={`game-placeholder-${i + 1}`} />)}
              </>
            )}

            {loadingError && (
              <Notification
                type={NotificationType.ERROR}
                title="Fehler beim Laden"
                subtitle="Bitte versuche es erneut."
              />
            )}

            {(AuthService.isAdmin() && !addingGame) && (
              <div className="SchedulePage__add-game-button">
                <Fab color="primary" onClick={this.handleAddGame}>
                  <AddIcon />
                </Fab>
              </div>
            )}
          </section>
        </section>
      </Page>
    );
  }
}

Schedule.propTypes = {
  history: ReactRouterProptypes.history.isRequired,
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(withTheme(Schedule));
