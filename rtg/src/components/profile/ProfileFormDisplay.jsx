import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton, TextField, Toggle } from 'material-ui';

import './ProfileForm.css';

const ProfileFormDisplay = props => (
  <div className="ProfileForm">
    <div className="ProfileForm__name-row">
      <TextField
        floatingLabelText="Vorname"
        value={props.firstName}
        errorText={props.firstNameError}
        style={{ width: '50%', marginRight: '10px' }}
        onChange={(e, v) => props.onFieldChange('firstName', v)}
      />
      <TextField
        floatingLabelText="Nachname"
        value={props.lastName}
        fullWidth
        errorText={props.lastNameError}
        style={{ width: '50%', marginLeft: '10px' }}
        onChange={(e, v) => props.onFieldChange('lastName', v)}
      />
    </div>

    <TextField
      floatingLabelText="E-Mail (nicht änderbar)"
      fullWidth
      value={props.email}
      disabled
    /><br />
    <TextField
      floatingLabelText="Weitere E-Mail (nur für News)"
      fullWidth
      value={props.email2}
      errorText={props.email2Error}
      onChange={(e, v) => props.onFieldChange('email2', v)}
    /><br />
    <TextField
      floatingLabelText="Ein Satz über Dich / Euch"
      fullWidth
      multiLine
      value={props.about || ''}
      errorText={props.aboutError}
      onChange={(e, v) => props.onFieldChange('about', v)}
    /><br />
    <TextField
      floatingLabelText="Wohnort"
      fullWidth
      value={props.location}
      errorText={props.locationError}
      onChange={(e, v) => props.onFieldChange('location', v)}
    /><br /><br />

    <Toggle
      label="Tägliche News per E-Mail"
      labelPosition="right"
      toggled={props.dailyEmails}
      onToggle={(e, v) => props.onFieldChange('dailyEmails', v)}
    /><br />
    <Toggle
      label="Tipperinnerungen per E-Mail"
      labelPosition="right"
      toggled={props.reminderEmails}
      onToggle={(e, v) => props.onFieldChange('reminderEmails', v)}
    /><br /><br />

    <div className="ProfileForm__button-wrapper">
      <RaisedButton
        label={props.isSaving ? 'Speichern...' : 'Änderungen speichern'}
        type="submit"
        primary
        disabled={props.isSaving}
        style={{ width: 250 }}
      />
    </div>
  </div>
);

ProfileFormDisplay.defaultProps = {
  email2: null,
  about: null,
  location: null,

  firstNameError: null,
  lastNameError: null,
  email2Error: null,
  aboutError: null,
  locationError: null,
};

ProfileFormDisplay.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  email2: PropTypes.string,
  about: PropTypes.string,
  location: PropTypes.string,

  reminderEmails: PropTypes.bool.isRequired,
  dailyEmails: PropTypes.bool.isRequired,

  firstNameError: PropTypes.string,
  lastNameError: PropTypes.string,
  email2Error: PropTypes.string,
  aboutError: PropTypes.string,
  locationError: PropTypes.string,

  isSaving: PropTypes.bool.isRequired,

  onFieldChange: PropTypes.func.isRequired,
};

export default ProfileFormDisplay;
