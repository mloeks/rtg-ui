import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';

import { DatePicker, TimePicker } from '@mui/pickers';

import Notification, { NotificationType } from '../Notification';

const AddGameFormDisplay = ({
  deadlineDate, deadlineTime, group, groups, groupError, kickoffDate, kickoffTime, nonFieldError,
  onCancel, onFieldChange, onSubmit, round, rounds, roundError, savingError, savingInProgress,
  teams, team1, team1Error, team2, team2Error, venue, venues, venueError,
}) => {
  const selectedRound = rounds.find((r) => r.id === round);
  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
      style={{
        margin: '0 auto',
        padding: 20,
        textAlign: 'left',
        maxWidth: 1024,
        boxSizing: 'border-box',
      }}
    >
      <Paper elevation={8} style={{ padding: 15 }}>
        <h3 style={{ margin: 0 }}>Neues Spiel hinzufügen</h3>

        <FormControl fullWidth error={Boolean(roundError)} style={{ margin: '8px 0' }}>
          <InputLabel htmlFor="AddGameForm__round">Runde</InputLabel>
          <Select
            input={<Input id="AddGameForm__round" />}
            value={round || ''}
            onChange={(e) => onFieldChange('round', e.target.value)}
          >
            <MenuItem value="" />
            {rounds.map((r) => <MenuItem key={`round-${r.id}`} value={r.id}>{r.name}</MenuItem>)}
          </Select>
          {Boolean(roundError) && <FormHelperText>{roundError}</FormHelperText>}
        </FormControl>
        <br />

        {selectedRound && !selectedRound.is_knock_out && (
          <FormControl fullWidth error={Boolean(groupError)} style={{ margin: '8px 0' }}>
            <InputLabel htmlFor="AddGameForm__group">Gruppe</InputLabel>
            <Select
              input={<Input id="AddGameForm__group" />}
              value={group || ''}
              onChange={(e) => onFieldChange('group', e.target.value)}
            >
              <MenuItem value="" />
              {groups.map((g) => <MenuItem key={`group-${g.id}`} value={g.id}>{g.name}</MenuItem>)}
            </Select>
            {Boolean(groupError) && <FormHelperText>{groupError}</FormHelperText>}
          </FormControl>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl error={Boolean(team1Error)} style={{ margin: '8px 0', flexGrow: 1 }}>
            <InputLabel htmlFor="AddGameForm__team1">Team 1</InputLabel>
            <Select
              input={<Input id="AddGameForm__team1" />}
              value={team1 || ''}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
              onChange={(e) => onFieldChange('team1', e.target.value)}
            >
              <MenuItem value="" />
              {teams.map((t) => <MenuItem key={`team1-${t.id}`} value={t.id}>{t.name}</MenuItem>)}
            </Select>
            {Boolean(team1Error) && <FormHelperText>{team1Error}</FormHelperText>}
          </FormControl>
          <span style={{ margin: '25px 10px 0' }}>vs.</span>
          <FormControl error={Boolean(team2Error)} style={{ margin: '8px 0', flexGrow: 1 }}>
            <InputLabel htmlFor="AddGameForm__team2">Team 2</InputLabel>
            <Select
              input={<Input id="AddGameForm__team2" />}
              value={team2 || ''}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
              onChange={(e) => onFieldChange('team2', e.target.value)}
            >
              <MenuItem value="" />
              {teams.map((t) => <MenuItem key={`team2-${t.id}`} value={t.id}>{t.name}</MenuItem>)}
            </Select>
            {Boolean(team2Error) && <FormHelperText>{team2Error}</FormHelperText>}
          </FormControl>
        </div>
        <br />

        <ListSubheader style={{ paddingLeft: 0 }}>Anstoß</ListSubheader>
        <div style={{ display: 'flex' }}>
          <DatePicker
            autoOk
            disablePast
            format="dd.MM.yyyy"
            label="Datum"
            value={kickoffDate}
            onChange={(date) => onFieldChange('kickoffDate', date)}
            style={{ marginRight: 5, width: '50%' }}
          />
          <TimePicker
            ampm={false}
            label="Uhrzeit (MESZ)"
            format="HH:mm 'Uhr'"
            value={kickoffTime}
            onChange={(time) => onFieldChange('kickoffTime', time)}
            style={{ marginLeft: 5, width: '50%' }}
          />
        </div>

        <ListSubheader style={{ paddingLeft: 0 }}>Deadline</ListSubheader>
        <div style={{ display: 'flex' }}>
          <DatePicker
            autoOk
            disablePast
            format="dd.MM.yyyy"
            label="Datum"
            value={deadlineDate}
            onChange={(date) => onFieldChange('deadlineDate', date)}
            style={{ marginRight: 5, width: '50%' }}
          />
          <TimePicker
            ampm={false}
            label="Uhrzeit (MESZ)"
            format="HH:mm 'Uhr'"
            value={deadlineTime}
            onChange={(time) => onFieldChange('deadlineTime', time)}
            style={{ marginLeft: 5, width: '50%' }}
          />
        </div>

        <FormControl fullWidth error={Boolean(venueError)} style={{ margin: '8px 0' }}>
          <InputLabel htmlFor="AddGameForm__venue">Austragungsort</InputLabel>
          <Select
            input={<Input id="AddGameForm__venue" />}
            value={venue || ''}
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            onChange={(e) => onFieldChange('venue', e.target.value)}
          >
            <MenuItem value="" />
            {venues.map((v) => <MenuItem key={`round-${v.id}`} value={v.id}>{v.city}</MenuItem>)}
          </Select>
          {Boolean(venueError) && <FormHelperText>{venueError}</FormHelperText>}
        </FormControl>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
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
  venueError: null,

  savingInProgress: false,
  savingError: false,
  nonFieldError: null,
};

AddGameFormDisplay.propTypes = {
  rounds: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  teams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  venues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
  })).isRequired,

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
  venueError: PropTypes.string,

  savingInProgress: PropTypes.bool,
  savingError: PropTypes.bool,
  nonFieldError: PropTypes.string,

  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddGameFormDisplay;
