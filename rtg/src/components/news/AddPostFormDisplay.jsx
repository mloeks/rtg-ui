import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
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

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link'
  ];

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

        {props.quill && <props.quill
          placeholder="Inhalt schreiben..."
          value={props.content}
          modules={quillModules}
          formats={quillFormats}
          onChange={(val) => props.onFieldChange('content', val)}
          style={{ marginTop: 10, fontSize: '20px' }}
        />}
        {!props.quill && <CircularProgress />}

        <br />
        <div className="AddPostForm__draft-info">
          {props.draftSaved &&
            <span className="AddPostForm__draft-info--success">
              <CheckIcon style={{ height: 20, width: 20, color: success }} />
              &nbsp;Entwurf gespeichert.
            </span>}
          {props.draftSaving && 'Speichern...'}
          {props.draftSavingError &&
            <span className="AddPostForm__draft-info--error">
              <ErrorIcon style={{ height: 20, width: 20, color: error }} />
              &nbsp;Fehler beim Zwischenspeichern!
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

        <RadioGroup
          className="AddPostForm__mail-choices-row"
          name="mailChoices"
          defaultSelected="sendMailToSubscribers"
          onChange={onMailChoiceChanged}
        >
          <FormControlLabel
            disabled={!props.sendMail}
            label="... an alle Abonnenten"
            value="sendMailToSubscribers"
          />
          <FormControlLabel
            disabled={!props.sendMail}
            label="... an alle aktiven User"
            value="sendMailToActive"
          />
          <FormControlLabel
            disabled={!props.sendMail}
            label="... nur an alle inaktiven User"
            value="sendMailToInactive"
          />
          <FormControlLabel
            disabled={!props.sendMail}
            label="... an alle bekannten User (aktiv & inaktiv)"
            value="sendMailToAll"
          />
        </RadioGroup>

        <br /><br />

        <div className="AddPostForm__button-row">
          <Button color="secondary" onClick={props.onCancel}>Abbrechen</Button>
          <Button type="submit" color="primary" disabled={props.savingInProgress || props.draftSaving}>
            Absenden
          </Button>
        </div>

        <div className="AddPostForm__feedback">
          {props.savingInProgress && <CircularProgress size={30} thickness={2.5} />}
          {props.savingError === true
            && (
              <Notification
                type={NotificationType.ERROR}
                title="Das hat leider nicht geklappt"
                subtitle={getSuitableSavingErrorSubtitle()}
              />
            )}
        </div>
      </Paper>
    </form>
  );
};

AddPostFormDisplay.defaultProps = {
  quill: null,

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
  quill: PropTypes.func,

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
