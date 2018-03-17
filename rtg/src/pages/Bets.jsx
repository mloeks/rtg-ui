import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'material-ui/Tabs';
import { Badge, CircularProgress } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import GameCard from '../components/GameCard';
import ExtraBetCard from '../components/ExtraBetCard';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';

import headingImg from '../theme/img/img7.jpg';
import './Bets.css';

const BettableTypes = {
  GAME: 'game',
  EXTRA: 'extra',
};

class Bets extends Component {
  static openBetsBadge(title, count) {
    if (count > 0) {
      return <Badge badgeContent={count} secondary badgeStyle={{ top: '10px' }}>{title}</Badge>;
    }
    return title;
  }

  constructor(props) {
    super(props);

    this.state = {
      bettables: [],
      extras: [],
      games: [],

      loading: true,
      loadingError: '',
    };
  }

  async componentDidMount() {
    await this.fetchData(`${API_BASE_URL}/rtg/bettables/?bets_open=true`, 'bettables');
    await this.fetchData(`${API_BASE_URL}/rtg/games/`, 'games');
    await this.fetchData(`${API_BASE_URL}/rtg/extras/`, 'extras');

    this.setState({ loading: false });
  }

  async fetchData(url, targetStateField) {
    this.setState({ loadingError: '' });
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? { [targetStateField]: response.json }
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  render() {
    const gameBettables =
      this.state.bettables.filter(bettable => bettable.type === BettableTypes.GAME);
    const extraBettables =
      this.state.bettables.filter(bettable => bettable.type === BettableTypes.EXTRA);

    return (
      <Page className="BetsPage">
        <BigPicture className="BetsPage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Deine Tipps</h1>
        </BigPicture>
        <section className="BetsPage__bets-area">
          <Tabs className="BetsPage__tabs">
            <Tab className="BetsPage__tab" label={Bets.openBetsBadge('Spiele', gameBettables.length)}>
              <h2>Tipps für die Spiele</h2>
              <p>
                Hier kannst du Deine Tipps für alle Spiele der Weltmeisterschaft abgeben.
                Bitte tippe vor Beginn der WM sämtliche Vorrundenspiele. Anschließend werden auch
                die Partien der K.O.-Runde hier auftauchen, sobald sie feststehen.
                <br /><br />Bitte beachte insbesondere die Deadlines zur Abgabe Deiner Tipps
                für die jeweiligen Spiele.
              </p>
              <section className="BetsPage__game-bets-container">
                {(!this.state.loading && !this.state.loadingError &&
                  gameBettables.length > 0 && this.state.games.length > 0) &&
                gameBettables.map((bettable) => {
                    const correspondingGame =
                      this.state.games.find(game => game.id === bettable.id);
                    return (<GameCard key={bettable.id} {...correspondingGame} />);
                  })
                }
                {(!this.state.loading && !this.state.loadingError && gameBettables.length === 0) &&
                  <div className="BetsPage__no-games-present">Keine offenen Tipps vorhanden.</div>
                }
              </section>
            </Tab>
            <Tab className="BetsPage__tab" label={Bets.openBetsBadge('Zusatztipps', extraBettables.length)}>
              <h2>Zusatztipps</h2>
              <p>
                Hier kannst du Deine Zusatztipps abgeben.
              </p>
              <section className="BetsPage__extra-bets-container">
                {(!this.state.loading && !this.state.loadingError) && this.state.extras
                    .map(extraBet => <ExtraBetCard key={extraBet.id} {...extraBet} />)
                }
                {(!this.state.loading && !this.state.loadingError && extraBettables.length === 0) &&
                  <div className="BetsPage__no-games-present">
                    Keine offenen Zusatztipps vorhanden.
                  </div>
                }
              </section>
            </Tab>
          </Tabs>

          {this.state.loading && <CircularProgress />}
          {this.state.loadingError &&
          <div className="BetsPage__loadingError">Fehler beim Laden.</div>
          }
        </section>
      </Page>
    );
  }
}

Bets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Bets);
