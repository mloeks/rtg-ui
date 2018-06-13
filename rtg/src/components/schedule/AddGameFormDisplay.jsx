import React from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  DatePicker,
  FlatButton,
  MenuItem,
  Paper,
  SelectField,
  Subheader,
  TimePicker
} from 'material-ui';
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

        <SelectField
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
        </SelectField>
        <br />

        {selectedRound && !selectedRound.is_knock_out && <SelectField
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
        </SelectField>}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SelectField
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
          </SelectField>
          <span style={{ margin: '25px 10px 0' }}>vs.</span>
          <SelectField
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
          </SelectField>
        </div>
        <br />

        <Subheader style={{ paddingLeft: 0 }}>Anstoß</Subheader>
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

        <Subheader style={{ paddingLeft: 0 }}>Deadline</Subheader>
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

        <SelectField
          floatingLabelText="Austragungsort"
          fullWidth
          value={props.venue}
          errorText={props.venueError}
          maxHeight={300}
          onChange={(e, i, val) => props.onFieldChange('venue', val)}
          menuItemStyle={{ textAlign: 'left' }}
        >
          <MenuItem value={null} primaryText="" />
          {props.venues.map(venue =>
            <MenuItem key={`round-${venue.id}`} value={venue.id} primaryText={venue.city} />)}
        </SelectField>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FlatButton label="Abbrechen" secondary onClick={props.onCancel} />
          <FlatButton
            type="submit"
            label="Spiel anlegen"
            primary
            disabled={props.savingInProgress}
          />
        </div>

        <div style={{ marginTop: 10, textAlign: 'center' }}>
          {props.savingInProgress &&
            <CircularProgress size={30} thickness={2.5} />}
          {props.savingError === true &&
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle={props.nonFieldError || 'Bitte überprüfe Deine Angaben.'}
            />}
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
