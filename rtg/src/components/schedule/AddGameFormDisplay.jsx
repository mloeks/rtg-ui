import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
// TODO find replacement for DatePicker
// import DatePicker from '@material-ui/core/DatePicker';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField';
// TODO find replacement for TimePicker
// import TimePicker from '@material-ui/core/TimePicker';
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

const AddGameFormDisplay = ({
  deadlineDate, deadlineTime, group, groups, groupError, kickoffDate, kickoffTime, nonFieldError,
  onCancel, onFieldChange, onSubmit, round, rounds, roundError, savingError, savingInProgress,
  teams, team1, team1Error, team2, team2Error, venue, venues, venueError,
}) => {
  const selectedRound = rounds.find(r => r.id === round);
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      style={{
        margin: '0 auto',
        padding: 20,
        textAlign: 'left',
        maxWidth: 1024,
        boxSizing: 'border-box',
      }}
    >
      <Paper zDepth={3} style={{ padding: 15 }}>
        <h3 style={{ margin: 0 }}>Neues Spiel hinzufügen</h3>

        <Select
          floatingLabelText="Runde"
          fullWidth
          value={round}
          errorText={roundError}
          onChange={(e, i, val) => onFieldChange('round', val)}
          menuItemStyle={{ textAlign: 'left' }}
        >
          <MenuItem value={null} primaryText="" />
          {rounds.map(r => <MenuItem key={`round-${r.id}`} value={r.id} primaryText={r.name} />)}
        </Select>
        <br />

        {selectedRound && !selectedRound.is_knock_out && (
          <Select
            floatingLabelText="Gruppe"
            fullWidth
            value={group}
            errorText={groupError}
            onChange={(e, i, val) => onFieldChange('group', val)}
            menuItemStyle={{ textAlign: 'left' }}
          >
            <MenuItem value={null} primaryText="" />
            {groups.map(g => <MenuItem key={`group-${g.id}`} value={g.id} primaryText={g.name} />)}
          </Select>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            floatingLabelText="Team 1"
            value={team1}
            errorText={team1Error}
            maxHeight={300}
            onChange={(e, i, val) => onFieldChange('team1', val)}
            menuItemStyle={{ textAlign: 'left' }}
          >
            <MenuItem value={null} primaryText="" />
            {teams.map(t => <MenuItem key={`team1-${t.id}`} value={t.id} primaryText={t.name} />)}
          </Select>
          <span style={{ margin: '25px 10px 0' }}>vs.</span>
          <Select
            floatingLabelText="Team 2"
            value={team2}
            errorText={team2Error}
            maxHeight={300}
            onChange={(e, i, val) => onFieldChange('team2', val)}
            menuItemStyle={{ textAlign: 'left' }}
          >
            <MenuItem value={null} primaryText="" />
            {teams.map(t => <MenuItem key={`team2-${t.id}`} value={t.id} primaryText={t.name} />)}
          </Select>
        </div>
        <br />

        <ListSubheader style={{ paddingLeft: 0 }}>Anstoß</ListSubheader>
        <div style={{ display: 'flex' }}>
          <TextField
            label="Datum"
            value={kickoffDate}
            onChange={(e, v) => onFieldChange('kickoffDate', v)}
            style={{ marginRight: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
          <TextField
            label="Uhrzeit (MESZ)"
            value={kickoffTime}
            onChange={(e, v) => onFieldChange('kickoffTime', v)}
            style={{ marginLeft: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
        </div>

        <ListSubheader style={{ paddingLeft: 0 }}>Deadline</ListSubheader>
        <div style={{ display: 'flex' }}>
          <TextField
            label="Datum"
            value={deadlineDate}
            onChange={(e, v) => onFieldChange('deadlineDate', v)}
            style={{ marginRight: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
          <TextField
            label="Uhrzeit (MESZ)"
            value={deadlineTime}
            onChange={(e, v) => onFieldChange('deadlineTime', v)}
            style={{ marginLeft: 5, width: '50%' }}
            textFieldStyle={{ width: '100%' }}
          />
        </div>

        <Select
          floatingLabelText="Austragungsort"
          fullWidth
          value={venue}
          errorText={venueError}
          maxHeight={300}
          onChange={(e, i, val) => onFieldChange('venue', val)}
          menuItemStyle={{ textAlign: 'left' }}
        >
          <MenuItem value={null} primaryText="" />
          {venues.map(v => <MenuItem key={`round-${v.id}`} value={v.id} primaryText={v.city} />)}
        </Select>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="secondary" onClick={onCancel}>Abbrechen</Button>
          <Button color="primary" type="submit" disabled={savingInProgress}>
            Spiel anlegen
          </Button>
        </div>

        <div style={{ marginTop: 10, textAlign: 'center' }}>
          {savingInProgress && <CircularProgress size={30} thickness={2.5} />}
          {savingError === true && (
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle={nonFieldError || 'Bitte überprüfe Deine Angaben.'}
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
  /* eslint-disable react/forbid-prop-types */
  rounds: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  venues: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */

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
