import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import AddGameFormDisplay from './AddGameFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import { format, startOfMinute } from 'date-fns';

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
      nonFieldError: responseJson.non_field_errors ? responseJson.non_field_errors[0] :  '',
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
    const datePart = format(dateString, 'YYYY-MM-DD');
    const timePart = format(startOfMinute(timeString), 'THH:mm:ss');
    return datePart + timePart;
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
      round: this.state.round,
      group: this.state.group,
      kickoff: AddGameForm.isoDateStringFromDateAndTime(this.state.kickoffDate, this.state.kickoffTime),
      deadline: AddGameForm.isoDateStringFromDateAndTime(this.state.deadlineDate, this.state.deadlineTime),
      hometeam: this.state.team1,
      awayteam: this.state.team2,
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
    this.setState(prevState => {
      const updatedState = { [fieldName]: value };
      if (fieldName === 'kickoffDate' && !prevState.deadlineDate) {
        updatedState['deadlineDate'] = value;
      }
      if (fieldName === 'kickoffTime' && !prevState.deadlineTime) {
        updatedState['deadlineTime'] = value;
      }
      return updatedState;
    });
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
      nonFieldError={this.state.nonFieldError}

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
