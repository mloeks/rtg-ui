import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, CircularProgress, FlatButton, Paper, TextField } from 'material-ui';
import Notification, { NotificationType } from '../Notification';

import './AddPostForm.css';

// TODO P3 structure checkboxes more logically (e-mail and force mail)
const AddPostFormDisplay = (props) => {
  const getSuitableSavingErrorSubtitle = () => {
    if (props.titleError || props.contentError) {
      return 'Bitte überprüfe Deine Eingaben.'
    } else if (props.nonFieldError) {
      return props.nonFieldError;
    }
    return 'Bitte versuche es später erneut.';
  };

  return (
    <form className="AddPostForm" noValidate onSubmit={props.onSubmit}>
      <Paper className="AddPostForm__paper" zDepth={3}>
        <h4 className="AddPostForm__heading">Neuigkeit hinzufügen:</h4>
        <TextField
          floatingLabelText="Titel"
          value={props.title}
          fullWidth
          errorText={props.titleError}
          onChange={(e, v) => props.onFieldChange('title', v)}
        /><br />
        <TextField
          floatingLabelText="Inhalt"
          value={props.content}
          fullWidth
          multiLine
          errorText={props.contentError}
          rows={3}
          onChange={(e, v) => props.onFieldChange('content', v)}
        /><br /><br />

        <Checkbox
          label="Bei den Neuigkeiten auf dieser Seite anzeigen"
          checked={props.appearInNews}
          onCheck={(e, v) => props.onFieldChange('appearInNews', v)}
        /><br />
        <Checkbox
          label="Per E-Mail an Abonennten versenden"
          checked={props.sendMailToSubscribers}
          onCheck={(e, v) => props.onFieldChange('sendMailToSubscribers', v)}
        /><br />
        <Checkbox
          label="Per E-Mail an alle Mitspieler versenden"
          checked={props.sendMailToAll}
          onCheck={(e, v) => props.onFieldChange('sendMailToAll', v)}
        /><br /><br />

        <div className="AddPostForm__button-row">
          <FlatButton type="submit" label="Speichern" primary disabled={props.savingInProgress} />
          <FlatButton label="Abbrechen" secondary onClick={props.onCancel} />
        </div>

        <div className="AddPostForm__feedback">
          {props.savingInProgress &&
            <CircularProgress size={30} thickness={2.5} />}
          {props.savingError === true &&
            <Notification
              type={NotificationType.ERROR}
              title="Das hat leider nicht geklappt"
              subtitle={getSuitableSavingErrorSubtitle()}
            />}
        </div>
      </Paper>
    </form>
  );
};

AddPostFormDisplay.defaultProps = {
  appearInNews: true,
  sendMailToSubscribers: true,
  sendMailToAll: false,

  nonFieldError: '',
  titleError: '',
  contentError: '',

  savingInProgress: false,
  savingError: false,
};

AddPostFormDisplay.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  appearInNews: PropTypes.bool,
  sendMailToSubscribers: PropTypes.bool,
  sendMailToAll: PropTypes.bool,

  nonFieldError: PropTypes.string,
  titleError: PropTypes.string,
  contentError: PropTypes.string,

  savingInProgress: PropTypes.bool,
  savingError: PropTypes.bool,

  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddPostFormDisplay;
