import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';

import ErrorIcon from '@mui/icons/Error';
import CheckIcon from '@mui/icons/Check';
import Notification, { NotificationType } from '../Notification';

import './AddPostForm.scss';

const Quill = React.lazy(() => {
  import('react-quill/dist/quill.snow.css');
  return import('react-quill');
});

const AddPostFormDisplay = ({
  appearInNews, title, content, contentError, draftSaved, draftSaving, draftSavingError,
  nonFieldError, onCancel, onFieldChange, onSubmit, savingError, savingInProgress,
  sendMail, sendMailOption, showMailOptions, theme, titleError,
}) => {
  const getSuitableSavingErrorSubtitle = () => {
    if (titleError || contentError) {
      return 'Bitte überprüfe Deine Eingaben.';
    }
    if (nonFieldError) { return nonFieldError; }
    return 'Bitte versuche es später erneut.';
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link',
  ];

  return (
    <form className="AddPostForm" noValidate onSubmit={onSubmit}>
      <Paper className="AddPostForm__paper" elevation={8}>
        <h4 className="AddPostForm__heading">Neuigkeit hinzufügen:</h4>
        <TextField
          label="Titel"
          value={title}
          fullWidth
          error={Boolean(titleError)}
          helperText={titleError || false}
          onChange={(e) => onFieldChange('title', e.target.value)}
          style={{ marginTop: 10 }}
        />
        <br />

        <Suspense fallback={<CircularProgress />}>
          <Quill
            placeholder="Inhalt schreiben..."
            value={content}
            modules={quillModules}
            formats={quillFormats}
            onChange={(val) => onFieldChange('content', val)}
            style={{ marginTop: 10, fontSize: '20px' }}
          />
        </Suspense>

        <br />
        <div className="AddPostForm__draft-info">
          {draftSaved && (
            <span className="AddPostForm__draft-info--success">
              <CheckIcon style={{ height: 20, width: 20, color: theme.palette.success.main }} />
              &nbsp;Entwurf gespeichert.
            </span>
          )}
          {draftSaving && 'Speichern...'}
          {draftSavingError && (
            <span className="AddPostForm__draft-info--error">
              <ErrorIcon style={{ height: 20, width: 20, color: theme.palette.error.main }} />
              &nbsp;Fehler beim Zwischenspeichern!
            </span>
          )}
        </div>

        {showMailOptions && (
          <>
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  checked={appearInNews}
                  onChange={(e, v) => onFieldChange('appearInNews', v)}
                />
              )}
              label="Bei den Neuigkeiten auf dieser Seite anzeigen"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  checked={sendMail}
                  onChange={(e, v) => onFieldChange('sendMail', v)}
                />
              )}
              label="Per E-Mail senden ..."
            />

            <RadioGroup
              className="AddPostForm__mail-choices-row"
              name="mailChoices"
              value={sendMailOption}
              onChange={(e, v) => onFieldChange('sendMailOption', v)}
              style={{ marginLeft: 30 }}
            >
              <FormControlLabel
                control={<Radio color="primary" />}
                disabled={!sendMail}
                label="... an alle Abonnenten"
                value="sendMailToSubscribers"
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                disabled={!sendMail}
                label="... an alle aktiven User"
                value="sendMailToActive"
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                disabled={!sendMail}
                label="... nur an alle inaktiven User"
                value="sendMailToInactive"
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                disabled={!sendMail}
                label="... an alle bekannten User (aktiv & inaktiv)"
                value="sendMailToAll"
              />
            </RadioGroup>
          </>
        )}

        <div className="AddPostForm__button-row">
          <Button color="secondary" onClick={onCancel}>Abbrechen</Button>
          <Button type="submit" color="primary" disabled={savingInProgress || draftSaving}>
            Absenden
          </Button>
        </div>

        <div className="AddPostForm__feedback">
          {savingInProgress && <CircularProgress size={30} thickness={2.5} />}
          {savingError === true
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
  appearInNews: true,
  sendMail: true,

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
  sendMailOption: PropTypes.string.isRequired,
  showMailOptions: PropTypes.bool.isRequired,

  nonFieldError: PropTypes.string,
  titleError: PropTypes.string,
  contentError: PropTypes.string,

  savingInProgress: PropTypes.bool,
  savingError: PropTypes.bool,

  draftSaving: PropTypes.bool,
  draftSaved: PropTypes.bool,
  draftSavingError: PropTypes.bool,

  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(AddPostFormDisplay);
