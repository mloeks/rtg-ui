import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import AddGameFormDisplay from './AddGameFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import AddPostForm from "../news/AddPostForm";

class AddGameForm extends Component {
  static resetFieldErrors() {
    return {
      round: '',
      group: '',
      team1: '',
      team2: '',
      kickoff: '',
      deadline: '',
      venue: '',
    };
  }

  static errorResponseToStateMapper(responseJson) {
    if (!responseJson) {
      return { savingError: true };
    }

    return {
      savingError: true,
      nonFieldError: responseJson.detail || '',
      fieldErrors: {
        round: responseJson.tournament_round ? responseJson.tournament_round[0] : '',
        group: responseJson.tournament_group ? responseJson.tournament_group[0] : '',
        team1: responseJson.hometeam ? responseJson.hometeam[0] : '',
        team2: responseJson.awayteam ? responseJson.awayteam[0] : '',
        kickoff: responseJson.kickoff ? responseJson.kickoff[0] : '',
        deadline: responseJson.deadline ? responseJson.deadline[0] : '',
        venue: responseJson.venue ? responseJson.venue[0] : '',
      },
    };
  }

  static isoDateStringFromDateAndTime(dateString, timeString) {
    // TODO parse and format
    return '2018-06-06T12:00:00Z';
  }

  constructor(props) {
    super(props);

    this.state = {
      rounds: [],
      groups: [],
      teams: [],
      venues: [],

      round: null,
      group: null,
      team1: null,
      team2: null,
      kickoffDate: null,
      kickoffTime: null,
      deadlineDate: null,
      deadlineTime: null,
      venue: null,

      loadingError: false,
      savingInProgress: false,
      savingError: false,

      nonFieldError: '',
      fieldErrors: AddGameForm.resetFieldErrors(),
    };

    this.saveGame = this.saveGame.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchData(`${API_BASE_URL}/rtg/tournamentrounds/`, 'rounds', false);
    this.fetchData(`${API_BASE_URL}/rtg/tournamentgroups/`, 'groups', false);
    this.fetchData(`${API_BASE_URL}/rtg/teams/`, 'teams', false);
    this.fetchData(`${API_BASE_URL}/rtg/venues/`, 'venues', false);
  }

  fetchData(url, targetStateField) {
    fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ?
            { [targetStateField]: response.json } : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  getPostBodyFromState() {
    return {
      kickoff: AddPostForm.isoDateStringFromDateAndTime(this.state.kickoffDate, this.state.kickoffTime),
      deadline: AddPostForm.isoDateStringFromDateAndTime(this.state.deadlineDate, this.state.deadlineTime),
      hometeam: this.state.team1,
      awayteam: this.state.team2,
      tournamentround: this.state.round,
      tournamentgroup: this.state.group,
      venue: this.state.venue,
    };
  }

  saveGame(game, successCallback, errorCallback) {
    fetch(`${API_BASE_URL}/rtg/games/`, {
      method: 'POST',
      body: JSON.stringify(game),
      headers: {
        Authorization: `Token ${AuthService.getToken()}`,
        'content-type': 'application/json',
      },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          successCallback(response.json);
        } else {
          errorCallback(response.json);
        }
      }).catch(() => errorCallback());
  }

  handleFieldUpdate(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  handleSave(e) {
    e.preventDefault();
    this.setState({ savingInProgress: true });

    this.saveGame(this.getPostBodyFromState(), (responseJson) => {
      this.setState({ savingInProgress: false });
      this.props.onSaved(responseJson);
    }, (responseJson) => {
      this.setState({
        savingInProgress: false,
        ...AddGameForm.errorResponseToStateMapper(responseJson),
      });
    });
  }

  render() {
    return (<AddGameFormDisplay
      rounds={this.state.rounds}
      groups={this.state.groups}
      teams={this.state.teams}
      venues={this.state.venues}

      round={this.state.round}
      group={this.state.group}
      team1={this.state.team1}
      team2={this.state.team2}
      kickoffDate={this.state.kickoffDate}
      kickoffTime={this.state.kickoffTime}
      deadlineDate={this.state.deadlineDate}
      deadlineTime={this.state.deadlineTime}
      venue={this.state.venue}

      roundError={this.state.fieldErrors.round}
      groupError={this.state.fieldErrors.group}
      team1Error={this.state.fieldErrors.team1}
      team2Error={this.state.fieldErrors.team2}
      kickoffError={this.state.fieldErrors.kickoff}
      deadlineError={this.state.fieldErrors.deadline}
      venueError={this.state.fieldErrors.venue}

      savingInProgress={this.state.savingInProgress}
      savingError={this.state.savingError}

      onFieldChange={this.handleFieldUpdate}
      onSubmit={this.handleSave}
      onCancel={this.props.onCancelled}
    />);
  }
}

AddGameForm.propTypes = {
  onSaved: PropTypes.func.isRequired,
  onCancelled: PropTypes.func.isRequired,
};

export default AddGameForm;
