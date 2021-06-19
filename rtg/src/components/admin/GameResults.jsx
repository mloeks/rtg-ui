import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import GameCard from '../GameCard';
import GameCardScoreEditor from '../GameCardScoreEditor';

import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';

class GameResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamesStarted: [],
      loading: true,
      loadingError: false,
    };
  }

  componentDidMount() {
    fetch(`${API_BASE_URL}/rtg/games/?kicked_off=true&ordering=-kickoff`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? { loading: false, gamesStarted: response.json.results }
            : { loading: false, loadingError: true }
        ));
      }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  render() {
    const { gamesStarted, loading, loadingError } = this.state;

    return (
      <>
        {loading && <CircularProgress />}
        {loadingError && (
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden"
            subtitle="Bitte versuche es erneut."
            containerStyle={{ margin: '20px auto', maxWidth: '640px' }}
          />
        )}

        {(!loading && !loadingError && gamesStarted.length === 0) && (
          <h4>Keine begonnenen Spiele gefunden.</h4>
        )}

        <div className="GameResults__games">
          {gamesStarted.map((game) => (
            <GameCard
              key={`GameCard-${game.id}`}
              hometeam={game.hometeam_name}
              hometeamAbbrev={game.hometeam_abbreviation}
              awayteam={game.awayteam_name}
              awayteamAbbrev={game.awayteam_abbreviation}
            >
              {/* TODO introduce GameCardResult (very similar to GameCardBet)
                  which handles saving of results */}
              <GameCardScoreEditor
                gameId={game.id}
                onChange={(score) => { console.log(`changed: ${score}`); }}
              />
            </GameCard>
          ))}
        </div>
      </>
    );
  }
}

export default GameResults;
