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
      nonFieldError: responseJson.non_field_errors ? responseJson.non_field_errors[0] : '',
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

  static saveGame(game, successCallback, errorCallback) {
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

    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchData(`${API_BASE_URL}/rtg/tournamentrounds/`, 'rounds', false);
    this.fetchData(`${API_BASE_URL}/rtg/tournamentgroups/`, 'groups', false);
    this.fetchData(`${API_BASE_URL}/rtg/teams/`, 'teams', false);
    this.fetchData(`${API_BASE_URL}/rtg/venues/`, 'venues', false);
  }

  getPostBodyFromState() {
    const {
      deadlineDate,
      deadlineTime,
      group,
      kickoffDate,
      kickoffTime,
      round,
      team1,
      team2,
      venue,
    } = this.state;

    return {
      round,
      group,
      kickoff: AddGameForm.isoDateStringFromDateAndTime(kickoffDate, kickoffTime),
      deadline: AddGameForm.isoDateStringFromDateAndTime(deadlineDate, deadlineTime),
      hometeam: team1,
      awayteam: team2,
      venue,
    };
  }

  fetchData(url, targetStateField) {
    fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ? { [targetStateField]: response.json } : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  handleFieldUpdate(fieldName, value) {
    this.setState((prevState) => {
      const updatedState = { [fieldName]: value };
      if (fieldName === 'kickoffDate' && !prevState.deadlineDate) {
        updatedState.deadlineDate = value;
      }
      if (fieldName === 'kickoffTime' && !prevState.deadlineTime) {
        updatedState.deadlineTime = value;
      }
      return updatedState;
    });
  }

  handleSave(e) {
    e.preventDefault();
    this.setState({ savingInProgress: true });

    AddGameForm.saveGame(this.getPostBodyFromState(), (responseJson) => {
      const { onSaved } = this.props;
      this.setState({ savingInProgress: false });
      onSaved(responseJson);
    }, (responseJson) => {
      this.setState({
        savingInProgress: false,
        ...AddGameForm.errorResponseToStateMapper(responseJson),
      });
    });
  }

  render() {
    const {
      deadlineDate,
      deadlineTime,
      fieldErrors,
      group,
      groups,
      kickoffDate,
      kickoffTime,
      nonFieldError,
      round,
      rounds,
      savingError,
      savingInProgress,
      team1,
      team2,
      teams,
      venue,
      venues,
    } = this.state;
    const { onCancelled } = this.props;

    return (
      <AddGameFormDisplay
        rounds={rounds}
        groups={groups}
        teams={teams}
        venues={venues}

        round={round}
        group={group}
        team1={team1}
        team2={team2}
        kickoffDate={kickoffDate}
        kickoffTime={kickoffTime}
        deadlineDate={deadlineDate}
        deadlineTime={deadlineTime}
        venue={venue}

        roundError={fieldErrors.round}
        groupError={fieldErrors.group}
        team1Error={fieldErrors.team1}
        team2Error={fieldErrors.team2}
        kickoffError={fieldErrors.kickoff}
        deadlineError={fieldErrors.deadline}
        venueError={fieldErrors.venue}

        savingInProgress={savingInProgress}
        savingError={savingError}
        nonFieldError={nonFieldError}

        onFieldChange={this.handleFieldUpdate}
        onSubmit={this.handleSave}
        onCancel={onCancelled}
      />
    );
  }
}

AddGameForm.propTypes = {
  onSaved: PropTypes.func.isRequired,
  onCancelled: PropTypes.func.isRequired,
};

export default AddGameForm;
