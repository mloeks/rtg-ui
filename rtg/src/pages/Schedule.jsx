import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import TabbedGames from '../components/TabbedGames';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';

import headingImg from '../theme/img/img2.jpg';

class Schedule extends Component {
  static allGroupNames(games) {
    return [...new Set(games.map(game => game.group.name))];
  }

  constructor(props) {
    super(props);

    this.state = {
      currentRound: null,
      games: [],

      loading: false,
      loadingError: '',
    };
  }

  componentDidMount() {
    this.loadGames();
  }

  async loadGames() {
    this.setState({ loading: true, loadingError: '' });
    return fetch(`${API_BASE_URL}/rtg/games/`, {
      method: 'GET',
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    })
      .then(FetchHelper.parseJson)
      .then((response) => {
        const responseJson = response.json;
        if (response.ok) {
          this.setState({ loading: false, games: responseJson });
        } else {
          this.setState({ loading: false, loadingError: true });
        }
      })
      .catch(() => {
        this.setState({ loading: false, loadingError: true });
      });
  }

  render() {
    return (
      <Page className="SchedulePage">
        <BigPicture className="Foyer__welcome" img={headingImg}>
          <h1 className="BigPicture__heading">Spielplan</h1>
        </BigPicture>

        {this.state.loading && <CircularProgress />}
        {this.state.loadingError &&
          <div className="Schedule__loadingError">Fehler beim Laden.</div>
        }

        {(!this.state.loading && !this.state.loadingError) && <TabbedGames
          tabs={Schedule.allGroupNames(this.state.games)}
          games={this.state.games}
          tabResolver={game => game.group.name}
        />}
      </Page>);
  }
}

export default Schedule;
