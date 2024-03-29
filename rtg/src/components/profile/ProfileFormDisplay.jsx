import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

import './ProfileForm.scss';

const ProfileFormDisplay = ({
  about, aboutError, dailyEmails, email, emailError, email2, email2Error, isSaving, firstName,
  firstNameError, formHasErrors, lastName, lastNameError, location, locationError,
  onFieldChange, reminderEmails,
}) => (
  <div className="ProfileForm">
    <div className="ProfileForm__name-row">
      <TextField
        error={Boolean(firstNameError)}
        label="Vorname"
        name="firstname"
        value={firstName}
        helperText={firstNameError || false}
        style={{ width: '50%', marginRight: '10px' }}
        onChange={(e) => onFieldChange('firstName', e.target.value)}
      />
      <TextField
        error={Boolean(lastNameError)}
        label="Nachname"
        name="lastname"
        value={lastName}
        fullWidth
        helperText={lastNameError || false}
        style={{ width: '50%', marginLeft: '10px' }}
        onChange={(e) => onFieldChange('lastName', e.target.value)}
      />
    </div>
    <br />

    <TextField
      error={Boolean(emailError)}
      fullWidth
      helperText={emailError || false}
      label="E-Mail"
      name="email"
      value={email}
      onChange={(e) => onFieldChange('email', e.target.value)}
    />
    <br />
    <br />
    <TextField
      label="Weitere E-Mail (nur für News)"
      name="email2"
      fullWidth
      value={email2}
      error={Boolean(email2Error)}
      helperText={email2Error || false}
      onChange={(e) => onFieldChange('email2', e.target.value)}
    />
    <br />
    <br />
    <TextField
      label="Ein Satz über Dich / Euch"
      name="about"
      fullWidth
      multiline
      value={about}
      error={Boolean(aboutError)}
      helperText={aboutError || false}
      onChange={(e) => onFieldChange('about', e.target.value)}
    />
    <br />
    <br />
    <TextField
      label="Wohnort"
      name="location"
      fullWidth
      value={location}
      error={Boolean(locationError)}
      helperText={locationError || false}
      onChange={(e) => onFieldChange('location', e.target.value)}
    />
    <br />
    <br />

    <FormControlLabel
      control={(
        <Switch
          checked={dailyEmails}
          color="primary"
          onChange={(e, v) => onFieldChange('dailyEmails', v)}
        />
      )}
      label="Tägliche News per E-Mail"
    />
    <br />
    <FormControlLabel
      control={(
        <Switch
          checked={reminderEmails}
          color="primary"
          onChange={(e, v) => onFieldChange('reminderEmails', v)}
        />
      )}
      label="Tipperinnerungen per E-Mail"
    />
    <br />
    <br />

    <div className="ProfileForm__button-wrapper">
      <Button
        className="qa-profile-form-submit"
        color="primary"
        variant="contained"
        type="submit"
        disabled={isSaving || formHasErrors}
        style={{ width: 250 }}
      >
        {isSaving ? 'Speichern...' : 'Änderungen speichern'}
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
