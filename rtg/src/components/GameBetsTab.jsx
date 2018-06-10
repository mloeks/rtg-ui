import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Alarm from 'material-ui/svg-icons/action/alarm';
import AvNotInterested from 'material-ui/svg-icons/av/not-interested';
import { distanceInWordsToNow, format } from 'date-fns';
import de from 'date-fns/locale/de';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import GameCard from './GameCard';
import GameCardBet, { SavingErrorType, SavingSuccessType } from './GameCardBet';
import NullGameCard from './NullGameCard';
import RtgSeparator from './RtgSeparator';
import { BetsStatusContext, countOpenBets } from '../pages/Bets';
import Notification, { NotificationType } from './Notification';
import BetsStatusPanel from './bets/BetsStatusPanel';
import SavingIssuesDialog from './bets/SavingIssuesDialog';
import { lightGrey } from '../theme/RtgTheme';

import './GameBetsTab.css';

// TODO P3 introduce interval to update deadline countdowns, or better all games without reload...
// TODO P3 takes pretty long to load if there are many bets
class GameBetsTab extends Component {
  static initialState() {
    return {
      bets: [],
      gamesWithOpenBets: [],
      gamesWithSavingIssues: [],

      shouldSave: false,
      showSavingSuccess: false,

      loading: true,
      loadingError: '',
    };
  }

  static getOpenBetsChangeFromSaveTypes(gamesWithSaveTypes) {
    let incrementalOpenBetsChange = 0;
    gamesWithSaveTypes.forEach((game) => {
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
    await this.fetchData(`${API_BASE_URL}/rtg/games/?limit=999&bets_open=true&ordering=deadline,kickoff`, 'gamesWithOpenBets', true);
    await this.fetchData(`${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}`, 'bets', false);

    this.props.onOpenBetsUpdate(countOpenBets(this.state.gamesWithOpenBets, this.state.bets));

    this.setState({ loading: false });
  }

  async fetchData(url, targetStateField, isPaginated) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ?
            { [targetStateField]: isPaginated ? response.json.results : response.json } :
            { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  createGameCardsWithDeadlineSubheadings(games, betsStatusContext) {
    const gameCardsWithDeadlineSubheadings = [];
    let lastDeadlineText = null;
    games.forEach((game) => {
      const relativeDeadlineText = `Noch ${distanceInWordsToNow(game.deadline, { locale: de })}`;
      const absoluteDeadlineText = format(game.deadline, 'dd. DD.MM. - HH:mm [Uhr]', { locale: de });
      if (lastDeadlineText === null || relativeDeadlineText !== lastDeadlineText) {
        gameCardsWithDeadlineSubheadings
          .push(
            <div
              className="GameBetsTab__deadline-headings-wrapper"
              key={`${game.id}-${game.deadline}`}
              style={{ height: 34 }}
            >
              <div className="GameBetsTab__deadline-headings">
                <RtgSeparator
                  content={this.createDeadlineWithIcon(game.deadline, relativeDeadlineText)}
                  contentStyle={{ margin: '3px 0', height: 28, lineHeight: '28px' }}
                />
                <RtgSeparator
                  content={this.createDeadlineWithIcon(game.deadline, absoluteDeadlineText)}
                  contentStyle={{ margin: '3px 0', height: 28, lineHeight: '28px' }}
                />
              </div>
            </div>,
          );
        lastDeadlineText = relativeDeadlineText;
      }
      const gameCardWithBet = (
        <GameCard key={game.id} style={{ marginBottom: 25 }} {...game} >
          <GameCardBet
            gameId={game.id}
            hadSaveIssues={this.state.gamesWithSavingIssues
              .some(failedGame => game.id === failedGame.id)}
            shouldSave={this.state.shouldSave}
            userBet={this.state.bets.find(bet => bet.bettable === game.id) || {}}
            onSaveFailure={(id, attemptedBet, type, detail) =>
              this.handleBetSaveDone(id, attemptedBet, type, detail, betsStatusContext)}
            onSaveSuccess={(id, savedBet, type, detail) => this.handleBetSaveDone(
              id, savedBet ? savedBet.result_bet : null, type, detail, betsStatusContext)}
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
        <Alarm
          className="GameBetsTab__deadline-separator-icon"
          color={this.props.muiTheme.palette.errorColor}
          style={{ width: 24, height: 24, marginRight: 5 }}
        />
        <span className="GameBetsTab__deadline-separator-text">{readableDeadlineText}</span>
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
  }

  // TODO P3 refactor this method
  handleBetSaveDone(gameId, newBetString, saveType, responseDetail, betsStatusContext) {
    const updatedGameWithSaveDetails = {
      ...this.gamesWithSaveType.get(gameId), newBet: newBetString, saveType, responseDetail,
    };
    this.gamesWithSaveType.set(gameId, updatedGameWithSaveDetails);

    const gamesWithSaveTypeValueArray = Array.from(this.gamesWithSaveType.values());
    const allBetsDone = !gamesWithSaveTypeValueArray.some(game => !game.saveType);
    if (allBetsDone) {
      const gamesWithSavingIssues = gamesWithSaveTypeValueArray
        .filter(game => game.saveType && Object.values(SavingErrorType).includes(game.saveType));
      this.props.onOpenBetsUpdate(GameBetsTab
        .getOpenBetsChangeFromSaveTypes(gamesWithSaveTypeValueArray), true);

      this.setState({
        shouldSave: false,
        showSavingSuccess: gamesWithSavingIssues.length === 0,
        gamesWithSavingIssues,
      });

      if (gamesWithSavingIssues.length === 0) {
        betsStatusContext.updateBetsHaveChanges(false);
      }

      setTimeout(() => {
        this.setState({ showSavingSuccess: false });
      }, 3000);
    }
  }

  render() {
    const gameCount = this.state.gamesWithOpenBets.length;

    return (
      <div className="GameBetsTab">
        <div style={{ padding: '0 10px' }}>
          <p>
            Bitte tippe zunächst <b>vor Beginn der WM</b> sämtliche Vorrundenspiele. Die
            Partien der K.O.-Runde werden hier auftauchen, sobald sie feststehen.
            <br /><br />Bitte beachte insbesondere die Deadlines zur Abgabe Deiner Tipps
            für die jeweiligen Spiele.
          </p>
        </div>

        <BetsStatusContext.Consumer>
          {betsStatusContext => (
            <section className="GameBetsTab__game-bets-container">
              {this.state.loading &&
                <Fragment>
                  <RtgSeparator content="..." />
                  {Array(3).fill('').map((v, i) => <NullGameCard key={`game-placeholder-${i}`} />)}
                </Fragment>}

              <SavingIssuesDialog
                open={this.state.gamesWithSavingIssues.length > 0}
                games={this.state.gamesWithSavingIssues}
                onClose={() => this.setState({ gamesWithSavingIssues: [] })}
              />

              {(!this.state.loading && !this.state.loadingError && gameCount > 0) &&
                this.createGameCardsWithDeadlineSubheadings(this.state.gamesWithOpenBets, betsStatusContext)}

              {(!this.state.loading && !this.state.loadingError && gameCount === 0) &&
                <div className="GameBetsTab__empty-state" style={{ color: lightGrey }}>
                  <AvNotInterested
                    color={lightGrey}
                    style={{ height: 80, width: 80, marginBottom: 10 }}
                  /><br />Keine offenen Tipps vorhanden.
                </div>}

              {this.state.loadingError &&
                <Notification title="Fehler beim Laden" type={NotificationType.ERROR} />
              }

              {(this.props.active && !this.state.loading && gameCount > 0) &&
                <BetsStatusPanel
                  hasChanges={betsStatusContext.betsHaveChanges}
                  saving={this.state.shouldSave}
                  success={this.state.showSavingSuccess}
                  onSave={this.handleSaveRequest}
                />}
            </section>
          )}
        </BetsStatusContext.Consumer>
      </div>
    );
  }
}

GameBetsTab.propTypes = {
  active: PropTypes.bool.isRequired,
  muiTheme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onOpenBetsUpdate: PropTypes.func.isRequired,
};

export default muiThemeable()(GameBetsTab);
