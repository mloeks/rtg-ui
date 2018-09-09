import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import DatePicker from '@material-ui/core/DatePicker';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import TimePicker from '@material-ui/core/TimePicker';
import areIntlLocalesSupported from 'intl-locales-supported';
import Notification, { NotificationType } from '../Notification';

let DateTimeFormat;

/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
if (areIntlLocalesSupported(['de'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/de');
}

const AddGameFormDisplay = (props) => {
  const selectedRound = props.rounds.find(round => round.id === props.round);
  return (
    <form
      noValidate
      onSubmit={props.onSubmit}
      style={{
        margin: '0 auto',
        padding: 20,
        textAlign: 'left',
        maxWidth: 1024,
        boxSizing: 'border-box'
      }}
    >
      <Paper zDepth={3} style={{ padding: 15 }}>
        <h3 style={{ margin: 0 }}>Neues Spiel hinzufügen</h3>

        <Select
          floatingLabelText="Runde"
          fullWidth
          value={props.round}
          errorText={props.roundError}
          onChange={(e, i, val) => props.onFieldChange('round', val)}
          menuItemStyle={{ textAlign: 'left' }}
        >
          <MenuItem value={null} primaryText="" />
          {props.rounds.map(round =>
            <MenuItem key={`round-${round.id}`} value={round.id} primaryText={round.name} />)}
        </Select>
        <br />

        {selectedRound && !selectedRound.is_knock_out && <Select
          floatingLabelText="Gruppe"
          fullWidth
          value={props.group}
          errorText={props.groupError}
          onChange={(e, i, val) => props.onFieldChange('group', val)}
          menuItemStyle={{ textAlign: 'left' }}
        >
          <MenuItem value={null} primaryText="" />
          {props.groups.map(group =>
            <MenuItem key={`group-${group.id}`} value={group.id} primaryText={group.name} />)}
        </Select>}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            floatingLabelText="Team 1"
            value={props.team1}
            errorText={props.team1Error}
            maxHeight={300}
            onChange={(e, i, val) => props.onFieldChange('team1', val)}
            menuItemStyle={{ textAlign: 'left' }}
          >
            <MenuItem value={null} primaryText="" />
            {props.teams.map(team =>
              <MenuItem key={`team1-${team.id}`} value={team.id} primaryText={team.name} />)}
          </Select>
          <span style={{ margin: '25px 10px 0' }}>vs.</span>
          <Select
            floatingLabelText="Team 2"
            value={props.team2}
            errorText={props.team2Error}
            maxHeight={300}
            onChange={(e, i, val) => props.onFieldChange('team2', val)}
            menuItemStyle={{ textAlign: 'left' }}
          >
            <MenuItem value={null} primaryText="" />
            {props.teams.map(team =>
              <MenuItem key={`team2-${team.id}`} value={team.id} primaryText={team.name} />)}
          </Select>
        </div>
        <br />

        <ListSubheader style={{ paddingLeft: 0 }}>Anstoß</ListSubheader>
        <div style={{ display: 'flex' }}>
          <DatePicker
            hintText="Datum"
            cancelLabel="Abbrechen"
            locale="de"
            DateTimeFormat={DateTimeFormat}
            value={props.kickoffDate}
            onChange={(e, v) => props.onFieldChange('kickoffDate', v)}
            style={{ marginRight: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
          <TimePicker
            format="24hr"
            hintText="Uhrzeit (MESZ)"
            minutesStep={5}
            cancelLabel="Abbrechen"
            value={props.kickoffTime}
            onChange={(e, v) => props.onFieldChange('kickoffTime', v)}
            style={{ marginLeft: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
        </div>

        <ListSubheader style={{ paddingLeft: 0 }}>Deadline</ListSubheader>
        <div style={{ display: 'flex' }}>
          <DatePicker
            hintText="Datum"
            cancelLabel="Abbrechen"
            locale="de"
            DateTimeFormat={DateTimeFormat}
            value={props.deadlineDate}
            onChange={(e, v) => props.onFieldChange('deadlineDate', v)}
            style={{ marginRight: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
          <TimePicker
            format="24hr"
            hintText="Uhrzeit (MESZ)"
            minutesStep={5}
            cancelLabel="Abbrechen"
            value={props.deadlineTime}
            onChange={(e, v) => props.onFieldChange('deadlineTime', v)}
            style={{ marginLeft: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
        </div>

        <Select
          floatingLabelText="Austragungsort"
          fullWidth
          value={props.venue}
          errorText={props.venueError}
          maxHeight={300}
          onChange={(e, i, val) => props.onFieldChange('venue', val)}
          menuItemStyle={{ textAlign: 'left' }}
        >
          <MenuItem value={null} primaryText="" />
          {props.venues.map(venue => <MenuItem key={`round-${venue.id}`} value={venue.id} primaryText={venue.city} />)}
        </Select>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="secondary" onClick={props.onCancel}>Abbrechen</Button>
          <Button color="primary" type="submit" disabled={props.savingInProgress}>
            Spiel anlegen
          </Button>
        </div>

        <div style={{ marginTop: 10, textAlign: 'center' }}>
          {props.savingInProgress &&
            <CircularProgress size={30} thickness={2.5} />}
          {props.savingError === true
            && (
              <Notification
                type={NotificationType.ERROR}
                title="Das hat leider nicht geklappt"
                subtitle={props.nonFieldError || 'Bitte überprüfe Deine Angaben.'}
              />
            )}
        </div>
      </Paper>
    </form>
  );
};

AddGameFormDisplay.defaultProps = {
  round: null,
  group: null,
  team1: null,
  team2: null,
  kickoffDate: null,
  kickoffTime: null,
  deadlineDate: null,
  deadlineTime: null,
  venue: null,

  roundError: null,
  groupError: null,
  team1Error: null,
  team2Error: null,
  kickoffError: null,
  deadlineError: null,
  venueError: null,

  savingInProgress: false,
  savingError: false,
  nonFieldError: null,
};

AddGameFormDisplay.propTypes = {
  rounds: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  venues: PropTypes.array.isRequired,

  round: PropTypes.number,
  group: PropTypes.number,
  team1: PropTypes.number,
  team2: PropTypes.number,
  kickoffDate: PropTypes.objectOf(Date),
  kickoffTime: PropTypes.objectOf(Date),
  deadlineDate: PropTypes.objectOf(Date),
  deadlineTime: PropTypes.objectOf(Date),
  venue: PropTypes.number,

  roundError: PropTypes.string,
  groupError: PropTypes.string,
  team1Error: PropTypes.string,
  team2Error: PropTypes.string,
  kickoffError: PropTypes.string,
  deadlineError: PropTypes.string,
  venueError: PropTypes.string,

  savingInProgress: PropTypes.bool,
  savingError: PropTypes.bool,
  nonFieldError: PropTypes.string,

  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddGameFormDisplay;
