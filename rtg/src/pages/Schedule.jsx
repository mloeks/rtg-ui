import React, { Component } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { CircularProgress, Divider, DropDownMenu, MenuItem } from 'material-ui';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import GameCard from '../components/GameCard';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';

import './Schedule.css';
import headingImg from '../theme/img/img2.jpg';

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRoundIndex: 'VOR',
      selectedGroupFilter: 'all',
      games: [],
      rounds: [],
      groups: [],

      loading: true,
      loadingError: '',
    };

    this.handleSelectedRoundChange = this.handleSelectedRoundChange.bind(this);
    this.handleGroupFilterChanged = this.handleGroupFilterChanged.bind(this);
    this.gamesFilter = this.gamesFilter.bind(this);
  }

  componentDidMount() {
    // TODO clean up and only do this after data has been loaded? otherwise it does not seem
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
  }

  componentWillUnmount() {
    // TODO function must be provided.
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

        {(!this.state.loading && !this.state.loadingError) &&
        gamesToDisplay.map(game => <GameCard key={game.id} {...game} />)
        }
        {(!this.state.loading && !this.state.loadingError && gamesToDisplay.length === 0) &&
        <div className="SchedulePage__no-games-present">Keine Spiele vorhanden.</div>
        }

        {this.state.loading && <CircularProgress />}
        {this.state.loadingError &&
          <div className="SchedulePage__loadingError">Fehler beim Laden.</div>
        }
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
