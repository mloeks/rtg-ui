import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Divider, IconButton, IconMenu } from 'material-ui';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import FetchHelper from '../service/FetchHelper';
import AuthService, { API_BASE_URL } from '../service/AuthService';

import headingImg from '../theme/img/img2.jpg';
import GameCard from "../components/GameCard";

class Schedule extends Component {
  static allGroupNames(games) {
    return [...new Set(games.map(game => game.group.name))];
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedRoundIndex: 1,
      selectedGroupFilter: 'Alle Gruppen',
      games: [],

      loading: false,
      loadingError: '',
    };

    this.handleSelectedRoundChange = this.handleSelectedRoundChange.bind(this);
    this.handleGroupFilterChanged = this.handleGroupFilterChanged.bind(this);
    this.gamesFilter = this.gamesFilter.bind(this);
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

  handleSelectedRoundChange(event, index, value) {
    this.setState({ selectedRoundIndex: value });
  }

  handleGroupFilterChanged(event, value) {
    this.setState({ selectedGroupFilter: value });
  }

  gamesFilter(game) {
    if (this.state.selectedGroupFilter === 'Alle Gruppen') {
      return true;
    }
    return game.group.name === this.state.selectedGroupFilter;
  }

  render() {
    return (
      <Page className="SchedulePage">
        <BigPicture className="Foyer__welcome" img={headingImg}>
          <h1 className="BigPicture__heading">Spielplan</h1>
        </BigPicture>

        <Toolbar>
          <ToolbarGroup firstChild>
            <DropDownMenu
              value={this.state.selectedRoundIndex}
              onChange={this.handleSelectedRoundChange}
            >
              <MenuItem value={1} primaryText="Vorrunde"/>
              <MenuItem value={2} primaryText="Achtelfinale"/>
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup>
            <IconMenu
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              iconButtonElement={<IconButton><ContentFilter/></IconButton>}
              onChange={this.handleGroupFilterChanged}
              value={this.state.selectedGroupFilter}
            >
              <MenuItem
                checked={this.state.selectedGroupFilter === 'Alle Gruppen'}
                insetChildren
                value="Alle Gruppen"
                primaryText="Alle Gruppen"
              />
              <Divider/>
              <MenuItem
                checked={this.state.selectedGroupFilter === 'Gruppe A'}
                insetChildren
                value="Gruppe A"
                primaryText="Gruppe A"
              />
              <MenuItem
                checked={this.state.selectedGroupFilter === 'Gruppe B'}
                insetChildren
                value="Gruppe B"
                primaryText="Gruppe B"
              />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>

        {(!this.state.loading && !this.state.loadingError) &&
        this.state.games
          .filter(this.gamesFilter)
          .map(game => <GameCard {...game} />)
        }

        {this.state.loading && <CircularProgress />}
        {this.state.loadingError &&
          <div className="Schedule__loadingError">Fehler beim Laden.</div>
        }
      </Page>);
  }
}

export default Schedule;
