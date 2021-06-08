import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import GameCard from '../GameCard';
import GameCardBet from '../GameCardBet';

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
    // TODO only request games which have kicked off, can be achieved with
    // kickoff_lt URL parameter and ISO date, but some prerequisites in the
    // backend seem to be necessary. See https://stackoverflow.com/a/38862380
    // Check if there is a standard way of filtering by date fields in DRF as well.
    fetch(`${API_BASE_URL}/rtg/games/?bets_open=false`, {
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

              {/* TODO introduce GameCardEditableScore component which should be
              refactored out of GameCardBet and used directly here.
              Using GameCardBet is just a quick hack to get something meaningful displayed.
              It's not what we intend to use here later. */}
              <GameCardBet
                gameId={game.id}
                hadSaveIssues={false}
                onSaveFailure={() => {}}
                onSaveSuccess={() => {}}
              />
            </GameCard>
          ))}
        </div>
      </>
    );
  }
}

export default GameResults;
