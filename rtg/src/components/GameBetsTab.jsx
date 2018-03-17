import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import GameCard from './GameCard';
import { BettableTypes } from '../pages/Bets';

import './GameBetsTab.css';

export default class GameBetsTab extends Component {
  static initialState() {
    return {
      bets: [],
      bettables: [],
      games: [],

      loading: true,
      loadingError: '',
    };
  }

  constructor(props) {
    super(props);

    this.state = GameBetsTab.initialState();

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      this.updateData();
    }
  }

  async updateData() {
    this.setState(GameBetsTab.initialState());
    await this.fetchData(`${API_BASE_URL}/rtg/bettables/?bets_open=true`, 'bettables');
    await this.fetchData(`${API_BASE_URL}/rtg/games/`, 'games');
    await this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets');

    this.props.onOpenBetsUpdate(this.state.bettables
      .filter(bettable => bettable.type === BettableTypes.GAME).length);

    this.setState({ loading: false });
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

  render() {
    // TODO reduce number of re-renders
    const gameBettables =
      this.state.bettables.filter(bettable => bettable.type === BettableTypes.GAME);
    const bettablesCount = gameBettables.length;

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
            bettablesCount > 0 && this.state.games.length > 0) &&
            gameBettables.map((bettable) => {
              const correspondingGame =
                this.state.games.find(game => game.id === bettable.id);
              return (<GameCard key={bettable.id} {...correspondingGame} />);
            })
          }

          {(!this.state.loading && !this.state.loadingError && bettablesCount === 0) &&
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
  onOpenBetsUpdate: PropTypes.func.isRequired,
};
