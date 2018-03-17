import React, { Component } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { CircularProgress } from 'material-ui';
import Timer from 'material-ui/svg-icons/image/timer';
import { distanceInWordsToNow, format } from 'date-fns';
import de from 'date-fns/locale/de';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import GameCard from './GameCard';
import GameCardBet from './GameCardBet';
import GameCardSeparator from './GameCardSeparator';
import { countOpenBets } from '../pages/Bets';

import './GameBetsTab.css';

// TODO introduce interval to update deadline countdowns, or better all games without reload...
class GameBetsTab extends Component {
  static initialState() {
    return {
      bets: [],
      gamesWithOpenBets: [],

      loading: true,
      loadingError: '',
    };
  }

  constructor(props) {
    super(props);
    this.state = GameBetsTab.initialState();

    this.fetchData = this.fetchData.bind(this);
    this.handleBetChanged = this.handleBetChanged.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      this.updateData();
    }
  }

  updateData() {
    this.setState(GameBetsTab.initialState(), async () => {
      await this.fetchData(`${API_BASE_URL}/rtg/games/?bets_open=true&ordering=deadline,kickoff`, 'gamesWithOpenBets');
      await this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets');

      this.props.onOpenBetsUpdate(countOpenBets(this.state.gamesWithOpenBets, this.state.bets));

      this.setState({ loading: false });
    });
  }

  async fetchData(url, targetStateField) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ? { [targetStateField]: response.json } : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  handleBetChanged(betId) {
    console.log(`bet ${betId} changed`);
    // TODO
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
            onChange={this.handleBetChanged}
            onBetAdded={() => this.props.onOpenBetsUpdateIncremental(-1)}
            onBetRemoved={() => this.props.onOpenBetsUpdateIncremental(1)}
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

  render() {
    // TODO reduce number of re-renders
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

          {(!this.state.loading && !this.state.loadingError &&
             this.state.gamesWithOpenBets.length > 0) && gameBetsItems}

          {(!this.state.loading && !this.state.loadingError &&
             this.state.gamesWithOpenBets.length === 0) &&
             <div className="GameBetsTab__no-games-present">Keine offenen Tipps vorhanden.</div>
          }
          {this.state.loadingError &&
            <div className="GameBetsTab__loadingError">Fehler beim Laden.</div>
          }
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