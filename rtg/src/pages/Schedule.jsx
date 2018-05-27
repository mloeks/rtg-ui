import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stickybits from 'stickybits';
import { CircularProgress, Divider, DropDownMenu, MenuItem } from 'material-ui';
import { format, isSameDay, parse } from 'date-fns';
import de from 'date-fns/locale/de';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import GameCard from '../components/GameCard';
import RtgSeparator from '../components/RtgSeparator';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import Notification, { NotificationType } from '../components/Notification';
import GameCardGameInfo from '../components/GameCardGameInfo';
import { isEnter } from '../service/KeyHelper';

import './Schedule.css';
import headingImg from '../theme/img/headings/cup_and_ball.jpg';
import { darkGrey, white } from "../theme/RtgTheme";
import { withRouter } from "react-router-dom";

// TODO P2 add possibility to add games for admins
// TODO P2 switch to current game/round automatically
class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRoundIndex: 'VOR',
      selectedGroupFilter: 'all',
      games: [],
      rounds: [],
      groups: [],
      bets: [],

      loading: true,
      loadingError: '',
    };
    this.stickybitsInstance = null;

    this.handleSelectedRoundChange = this.handleSelectedRoundChange.bind(this);
    this.handleGroupFilterChanged = this.handleGroupFilterChanged.bind(this);
    this.gamesFilter = this.gamesFilter.bind(this);
  }

  componentDidMount() {
    this.stickybitsInstance = stickybits('.SchedulePage__toolbar');

    this.fetchData(`${API_BASE_URL}/rtg/tournamentrounds/`, 'rounds');
    this.fetchData(`${API_BASE_URL}/rtg/tournamentgroups/`, 'groups');
    this.fetchData(`${API_BASE_URL}/rtg/games/`, 'games');
    this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets');
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

  async fetchData(url, targetStateField) {
    this.setState({ loading: true, loadingError: '' });
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok
            ? { loading: false, [targetStateField]: response.json }
            : { loading: false, loadingError: true }
        ));
      }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  handleSelectedRoundChange(event, index, value) {
    this.setState({ selectedRoundIndex: value });
  }

  handleGroupFilterChanged(event, index, value) {
    this.setState({ selectedGroupFilter: value });
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
          />);
        lastGameDay = game.kickoff;
      }
      const userBet = bets.find(bet => bet.bettable === game.id) || {};
      gameCardsWithDateSubheadings.push(
        <div
          key={game.id}
          role="button"
          className="GameCard__click-wrapper"
          tabIndex={0}
          onClick={() => this.props.history.push('/bets')}
          onKeyPress={e => (isEnter(e) && this.props.history.push('/bets'))}
        >
          <GameCard userBet={userBet} {...game}>
            <GameCardGameInfo
              city={game.city}
              kickoff={parse(game.kickoff)}
              result={game.homegoals !== -1 && game.awaygoals !== -1 ? `${game.homegoals} : ${game.awaygoals}` : null}
              resultBetType={userBet.result_bet_type}
              points={userBet.points}
              userBet={userBet.result_bet}
            />
          </GameCard>
        </div>,
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

        <section className="SchedulePage__content">
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

          <section className="SchedulePage__game-container">
            {(!this.state.loading && !this.state.loadingError) &&
              gameContainerItems.map(game => game)
            }
            {/* TODO P2 style empty-state nicer */}
            {(!this.state.loading && !this.state.loadingError && gamesToDisplay.length === 0) &&
            <div className="SchedulePage__no-games-present">Keine Spiele vorhanden.</div>
            }

            {this.state.loading && <CircularProgress />}
            {this.state.loadingError &&
              <Notification
                type={NotificationType.ERROR}
                title="Fehler beim Laden"
                subtitle="Bitte versuche es erneut."
              />
            }
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
