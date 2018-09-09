import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';

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
      floatingLabelText="E-Mail"
      fullWidth
      value={props.email}
      errorText={props.emailError}
      onChange={(e, v) => props.onFieldChange('email', v)}
    />
    <br />
    <TextField
      floatingLabelText="Weitere E-Mail (nur für News)"
      fullWidth
      value={props.email2}
      errorText={props.email2Error}
      onChange={(e, v) => props.onFieldChange('email2', v)}
    />
    <br />
    <TextField
      floatingLabelText="Ein Satz über Dich / Euch"
      fullWidth
      multiLine
      value={props.about}
      errorText={props.aboutError}
      onChange={(e, v) => props.onFieldChange('about', v)}
    />
    <br />
    <TextField
      floatingLabelText="Wohnort"
      fullWidth
      value={props.location}
      errorText={props.locationError}
      onChange={(e, v) => props.onFieldChange('location', v)}
    />
    <br />
    <br />

    <Switch
      label="Tägliche News per E-Mail"
      labelPosition="right"
      toggled={props.dailyEmails}
      onToggle={(e, v) => props.onFieldChange('dailyEmails', v)}
    />
    <br />
    <Switch
      label="Tipperinnerungen per E-Mail"
      labelPosition="right"
      toggled={props.reminderEmails}
      onToggle={(e, v) => props.onFieldChange('reminderEmails', v)}
    />
    <br />
    <br />

    <div className="ProfileForm__button-wrapper">
      <Button
        variant="raised"
        type="submit"
        color="primary"
        disabled={props.isSaving || props.formHasErrors}
        style={{ width: 250 }}
      >
        {props.isSaving ? 'Speichern...' : 'Änderungen speichern'}
      </Button>
    </div>
  </div>
);

ProfileFormDisplay.defaultProps = {
  about: '',
  location: '',
  email2: '',

  firstNameError: null,
  lastNameError: null,
  emailError: null,
  email2Error: null,
  aboutError: null,
  locationError: null,

  formHasErrors: false,
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
  emailError: PropTypes.string,
  email2Error: PropTypes.string,
  aboutError: PropTypes.string,
  locationError: PropTypes.string,

  isSaving: PropTypes.bool.isRequired,
  formHasErrors: PropTypes.bool.isRequired,

  onFieldChange: PropTypes.func.isRequired,
};

export default ProfileFormDisplay;
