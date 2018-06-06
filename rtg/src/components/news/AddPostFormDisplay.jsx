import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, CircularProgress, FlatButton, Paper, RadioButton, RadioButtonGroup, TextField } from 'material-ui';
import AlertError from 'material-ui/svg-icons/alert/error';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import Notification, { NotificationType } from '../Notification';
import { error, success } from '../../theme/RtgTheme';

import './AddPostForm.css';

const AddPostFormDisplay = (props) => {
  const getSuitableSavingErrorSubtitle = () => {
    if (props.titleError || props.contentError) {
      return 'Bitte überprüfe Deine Eingaben.';
    } else if (props.nonFieldError) {
      return props.nonFieldError;
    }
    return 'Bitte versuche es später erneut.';
  };

  const onMailChoiceChanged = (event, value) => {
    const mailChoices =
      ['sendMailToSubscribers', 'sendMailToActive', 'sendMailToInactive', 'sendMailToAll'];
    const updatedMailRelatedFields = {};
    for (let i = 0; i < mailChoices.length; i += 1) {
      updatedMailRelatedFields[mailChoices[i]] = value === mailChoices[i];
    }
    props.onFieldsChange(updatedMailRelatedFields);
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
        /><br />
        <div className="AddPostForm__draft-info">
          {props.draftSaved &&
            <span className="AddPostForm__draft-info--success">
              <NavigationCheck style={{ height: 20, width: 20, color: success }} />&nbsp;
              Entwurf gespeichert.
            </span>}
          {props.draftSaving && 'Speichern...'}
          {props.draftSavingError &&
            <span className="AddPostForm__draft-info--error">
              <AlertError style={{ height: 20, width: 20, color: error }} />&nbsp;
              Fehler beim Zwischenspeichern!
            </span>}
        </div>
        <br />

        <Checkbox
          label="Bei den Neuigkeiten auf dieser Seite anzeigen"
          checked={props.appearInNews}
          onCheck={(e, v) => props.onFieldChange('appearInNews', v)}
        /><br />
        <Checkbox
          label="Per E-Mail senden ..."
          checked={props.sendMail}
          onCheck={(e, v) => props.onFieldChange('sendMail', v)}
        /><br />

        <RadioButtonGroup
          className="AddPostForm__mail-choices-row"
          name="mailChoices"
          defaultSelected="sendMailToSubscribers"
          onChange={onMailChoiceChanged}
        >
          <RadioButton
            disabled={!props.sendMail}
            label="... an alle Abonnenten"
            value="sendMailToSubscribers"
          />
          <RadioButton
            disabled={!props.sendMail}
            label="... an alle aktiven User"
            value="sendMailToActive"
          />
          <RadioButton
            disabled={!props.sendMail}
            label="... nur an alle inaktiven User"
            value="sendMailToInactive"
          />
          <RadioButton
            disabled={!props.sendMail}
            label="... an alle bekannten User (aktiv & inaktiv)"
            value="sendMailToAll"
          />
        </RadioButtonGroup>

        <br /><br />

        <div className="AddPostForm__button-row">
          <FlatButton label="Abbrechen" secondary onClick={props.onCancel} />
          <FlatButton
            type="submit"
            label="Speichern"
            primary
            disabled={props.savingInProgress || props.draftSaving}
          />
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
  sendMail: true,
  sendMailToSubscribers: true,
  sendMailToActive: false,
  sendMailToAll: false,

  nonFieldError: '',
  titleError: '',
  contentError: '',

  savingInProgress: false,
  savingError: false,

  draftSaving: false,
  draftSaved: false,
  draftSavingError: false,
};

AddPostFormDisplay.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  appearInNews: PropTypes.bool,
  sendMail: PropTypes.bool,
  sendMailToSubscribers: PropTypes.bool,
  sendMailToActive: PropTypes.bool,
  sendMailToAll: PropTypes.bool,

  nonFieldError: PropTypes.string,
  titleError: PropTypes.string,
  contentError: PropTypes.string,

  savingInProgress: PropTypes.bool,
  savingError: PropTypes.bool,

  draftSaving: PropTypes.bool,
  draftSaved: PropTypes.bool,
  draftSavingError: PropTypes.bool,

  onFieldChange: PropTypes.func.isRequired,
  onFieldsChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddPostFormDisplay;
