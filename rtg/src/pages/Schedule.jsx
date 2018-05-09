import React, { Component } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { CircularProgress, Divider, DropDownMenu, MenuItem } from 'material-ui';
import { format, isSameDay, parse } from 'date-fns';
import de from 'date-fns/locale/de';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import GameCard from '../components/GameCard';
import GameCardSeparator from '../components/GameCardSeparator';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import Notification, { NotificationType } from '../components/Notification';

import './Schedule.css';
import headingImg from '../theme/img/headings/cup_and_ball.jpg';

// TODO P2 switch to current game/round automatically
class Schedule extends Component {
  static createGameCardsWithDateSubheadings(games, bets) {
    const gameCardsWithDateSubheadings = [];
    let lastGameDay = null;
    games.forEach((game) => {
      if (lastGameDay === null || !isSameDay(game.kickoff, lastGameDay)) {
        gameCardsWithDateSubheadings
          .push(<GameCardSeparator
            key={game.kickoff}
            content={format(parse(game.kickoff), 'dddd D. MMMM', { locale: de })}
          />);
        lastGameDay = game.kickoff;
      }
      gameCardsWithDateSubheadings.push(
        <GameCard
          key={game.id}
          userBet={bets.find(bet => bet.bettable === game.id) || {}}
          {...game}
        />,
      );
    });
    return gameCardsWithDateSubheadings;
  }

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

    this.handleSelectedRoundChange = this.handleSelectedRoundChange.bind(this);
    this.handleGroupFilterChanged = this.handleGroupFilterChanged.bind(this);
    this.gamesFilter = this.gamesFilter.bind(this);
  }

  componentDidMount() {
    // TODO P2 avoid jumping content when slowly scrolling below threshold
    // TODO P3 clean up and only do this after data has been loaded? otherwise it does not seem
    // to work properly when top is no 0 on page load.
    const toolbar = document.getElementById('schedule-toolbar');
    toolbar.setAttribute('data-sticky-initial', toolbar.getBoundingClientRect().top);

    document.addEventListener('scroll', () => {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      const bottom = document.documentElement.scrollHeight || document.body.scrollHeight;

      const stickyInitial = parseInt(toolbar.getAttribute('data-sticky-initial'), 10);
      const stickyEnter = parseInt(toolbar.getAttribute('data-sticky-enter'), 10) || stickyInitial;
      const stickyExit = parseInt(toolbar.getAttribute('data-sticky-exit'), 10) || bottom;

      if (top >= stickyEnter && top <= stickyExit) {
        toolbar.classList.add('sticky');
      } else {
        toolbar.classList.remove('sticky');
      }
    });

    this.fetchData(`${API_BASE_URL}/rtg/tournamentrounds/`, 'rounds');
    this.fetchData(`${API_BASE_URL}/rtg/tournamentgroups/`, 'groups');
    this.fetchData(`${API_BASE_URL}/rtg/games/`, 'games');
    this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets');
  }

  componentWillUnmount() {
    // TODO P2 function must be provided.
    // document.removeEventListener('scroll');
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

  render() {
    const gamesToDisplay = this.state.games.filter(this.gamesFilter);
    const gameContainerItems =
      Schedule.createGameCardsWithDateSubheadings(gamesToDisplay, this.state.bets);

    return (
      <Page className="SchedulePage">
        <BigPicture className="SchedulePage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Spielplan</h1>
        </BigPicture>

        <section
          id="schedule-toolbar"
          className="SchedulePage__toolbar"
          data-sticky-enter={this.props.stickyToolbarEnter}
          data-sticky-exit={this.props.stickyToolbarExit}
          style={{
            color: this.props.muiTheme.palette.canvasColor,
            backgroundColor: this.props.muiTheme.palette.scheduleToolbarColor,
          }}
        >
          <div className="SchedulePage__toolbar-title">Spiele auswählen:</div>
          <DropDownMenu
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            value={this.state.selectedRoundIndex}
            onChange={this.handleSelectedRoundChange}
            labelStyle={{ color: this.props.muiTheme.palette.canvasColor }}
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
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            value={this.state.selectedGroupFilter}
            onChange={this.handleGroupFilterChanged}
            labelStyle={{ color: this.props.muiTheme.palette.canvasColor }}
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
      </Page>);
  }
}

Schedule.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  stickyToolbarEnter: PropTypes.string,
  stickyToolbarExit: PropTypes.string,
};

export default muiThemeable()(Schedule);
