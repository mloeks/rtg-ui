import React, { Component } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { CircularProgress, FloatingActionButton, LinearProgress } from 'material-ui';
import ContentSave from 'material-ui/svg-icons/content/save';
import Timer from 'material-ui/svg-icons/image/timer';
import { distanceInWordsToNow, format } from 'date-fns';
import de from 'date-fns/locale/de';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import GameCard from './GameCard';
import GameCardBet, { SavingErrorType, SavingSuccessType } from './GameCardBet';
import GameCardSeparator from './GameCardSeparator';
import { countOpenBets } from '../pages/Bets';
import SavingIssuesDialog from './bets/SavingIssuesDialog';
import Notification, { NotificationType } from './Notification';

import './GameBetsTab.css';

// TODO P1 better design of floating button and/or save button on mobile and desktop
// TODO P2 avoid floating button to float over footer
// TODO P3 introduce interval to update deadline countdowns, or better all games without reload...
// TODO P3 switch deadline info between relative distance and absolute date (css only?)
class GameBetsTab extends Component {
  static initialState() {
    return {
      bets: [],
      gamesWithOpenBets: [],
      gamesWithSavingIssues: [],

      showSaveButton: false,
      shouldSave: false,
      showSavingIndicator: false,
      showSavingSuccess: false,

      loading: true,
      loadingError: '',
    };
  }

  static getOpenBetsChangeFromSaveTypes(gamesWithSaveTypes) {
    let incrementalOpenBetsChange = 0;
    gamesWithSaveTypes.forEach(game => {
      if (game.saveType === SavingSuccessType.ADDED) {
        incrementalOpenBetsChange -= 1;
      } else if (game.saveType === SavingSuccessType.DELETED) {
        incrementalOpenBetsChange += 1;
      }
    });
    return incrementalOpenBetsChange;
  }

  constructor(props) {
    super(props);
    this.state = GameBetsTab.initialState();
    this.gamesWithSaveType = new Map();
    this.savingIndicatorTimeout = null;

    this.fetchData = this.fetchData.bind(this);
    this.handleSaveRequest = this.handleSaveRequest.bind(this);
    this.handleBetSaveDone = this.handleBetSaveDone.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      this.setState(GameBetsTab.initialState(), () => {
        this.updateData();
      });
    }
  }

  async updateData() {
    await this.fetchData(`${API_BASE_URL}/rtg/games/?bets_open=true&ordering=deadline,kickoff`, 'gamesWithOpenBets');
    await this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets');

    this.props.onOpenBetsUpdate(countOpenBets(this.state.gamesWithOpenBets, this.state.bets));

    this.setState({ loading: false });
  }

  async fetchData(url, targetStateField) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ?
            { [targetStateField]: response.json, showSaveButton: true } :
            { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  createGameCardsWithDeadlineSubheadings(games) {
    const gameCardsWithDeadlineSubheadings = [];
    let lastDeadlineText = null;
    games.forEach((game) => {
      const deadlineText = `Noch ${distanceInWordsToNow(game.deadline, { locale: de })}`;
      if (lastDeadlineText === null || deadlineText !== lastDeadlineText) {
        gameCardsWithDeadlineSubheadings
          .push(<GameCardSeparator
            key={`${game.id}-${game.deadline}`}
            content={this.createDeadlineWithIcon(game.deadline, deadlineText)}
          />);
        lastDeadlineText = deadlineText;
      }
      const gameCardWithBet = (
        <GameCard key={game.id} {...game} >
          <GameCardBet
            gameId={game.id}
            shouldSave={this.state.shouldSave}
            userBet={this.state.bets.find(bet => bet.bettable === game.id) || {}}
            onSaveDone={this.handleBetSaveDone}
          />
        </GameCard>
      );

      gameCardsWithDeadlineSubheadings.push(gameCardWithBet);
    });
    return gameCardsWithDeadlineSubheadings;
  }

  createDeadlineWithIcon(deadlineDate, readableDeadlineText) {
    return (
      <div className="GameBetsTab__deadline-separator">
        <Timer
          className="GameBetsTab__deadline-separator-icon"
          color={this.props.muiTheme.palette.errorColor}
          style={{ width: '28px', height: '28px', marginRight: '5px' }}
        />
        <span
          className="GameBetsTab__deadline-separator-text"
          title={format(deadlineDate, 'dd. DD. MMMM - HH:mm [Uhr]', { locale: de })}
        >{readableDeadlineText}
        </span>
      </div>
    );
  }

  handleSaveRequest() {
    this.setState((prevState) => {
      this.gamesWithSaveType.clear();

      prevState.gamesWithOpenBets.forEach((game) => {
        this.gamesWithSaveType.set(game.id, game);
      });

      return { shouldSave: true, gamesWithSavingIssues: [] };
    });

    this.savingIndicatorTimeout = setTimeout(() => {
      this.setState({ showSavingIndicator: true });
    }, 500);
  }

  // TODO P2 refactor this method
  handleBetSaveDone(gameId, newBet, saveType, responseDetail) {
    const updatedGameWithSaveDetails = {
      ...this.gamesWithSaveType.get(gameId), newBet, saveType, responseDetail,
    };
    this.gamesWithSaveType.set(gameId, updatedGameWithSaveDetails);

    // TODO P1 has no IE support -> does Babel handle this? Polyfill otherwise.
    const gamesWithSaveTypeValueArray = Array.from(this.gamesWithSaveType.values());
    const allBetsDone = !gamesWithSaveTypeValueArray.some(game => !game.saveType);
    if (allBetsDone) {
      clearInterval(this.savingIndicatorTimeout);
      const gamesWithSavingIssues = gamesWithSaveTypeValueArray
        .filter(game => game.saveType &&
          (game.saveType === SavingErrorType.FAILED ||
            game.saveType === SavingErrorType.INCOMPLETE));
      this.props.onOpenBetsUpdateIncremental(GameBetsTab
        .getOpenBetsChangeFromSaveTypes(gamesWithSaveTypeValueArray));

      this.setState({
        shouldSave: false,
        showSavingIndicator: false,
        showSavingSuccess: gamesWithSavingIssues.length === 0,
        gamesWithSavingIssues,
      });
      setTimeout(() => {
        this.setState({ showSavingSuccess: false });
      }, 3000);
    }
  }

  render() {
    const gameBetsItems = this.createGameCardsWithDeadlineSubheadings(this.state.gamesWithOpenBets);

    return (
      <div className="GameBetsTab">
        <h2>Tipps für die Spiele</h2>
        <p>
          Hier kannst du Deine Tipps für alle Spiele der Weltmeisterschaft abgeben.
          Bitte tippe vor Beginn der WM sämtliche Vorrundenspiele. Anschließend werden auch
          die Partien der K.O.-Runde hier auftauchen, sobald sie feststehen.
          <br /><br />Bitte beachte insbesondere die Deadlines zur Abgabe Deiner Tipps
          für die jeweiligen Spiele.
        </p>
        <section className="GameBetsTab__game-bets-container">
          {this.state.loading && <CircularProgress className="GameBetsTab__loadingSpinner" />}

          <SavingIssuesDialog
            open={this.state.gamesWithSavingIssues.length > 0}
            games={this.state.gamesWithSavingIssues}
            onClose={() => this.setState({ gamesWithSavingIssues: [] })}
          />

          {/* TODO P3 refactor all this bottom notifiaction stuff into an own component */}
          {this.state.shouldSave && <div className="GameBetsTab__saving-overlay" />}
          <div
            className={`GameBetsTab__saving-info
              ${(this.state.showSavingIndicator || this.state.showSavingSuccess) ? ' GameBetsTab__saving-info--show' : ''}
              ${this.state.showSavingSuccess ? ' GameBetsTab__saving-info--success' : ''}`}
          >
            {this.state.showSavingIndicator &&
              <LinearProgress mode="indeterminate" style={{ position: 'absolute', top: 0 }} />}
            {this.state.showSavingIndicator && <span>Speichern...</span>}
            {this.state.showSavingSuccess && <span>Änderungen gespeichert.</span>}
          </div>

          {(!this.state.loading && !this.state.loadingError &&
             this.state.gamesWithOpenBets.length > 0) && gameBetsItems}

          {(!this.state.loading && !this.state.loadingError &&
             this.state.gamesWithOpenBets.length === 0) &&
             <div className="GameBetsTab__no-games-present">Keine offenen Tipps vorhanden.</div>
          }
          {this.state.loadingError &&
            <Notification title="Fehler beim Laden" type={NotificationType.ERROR} />
          }

          {(!this.state.loading && this.state.showSaveButton) &&
            <FloatingActionButton
              className="GameBetsTab__save-button"
              disabled={this.state.shouldSave}
            ><ContentSave onClick={this.handleSaveRequest} />
            </FloatingActionButton>}
        </section>
      </div>
    );
  }
}

GameBetsTab.propTypes = {
  active: PropTypes.bool.isRequired,
  muiTheme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onOpenBetsUpdate: PropTypes.func.isRequired,
  onOpenBetsUpdateIncremental: PropTypes.func.isRequired,
};

export default muiThemeable()(GameBetsTab);
