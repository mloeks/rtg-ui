import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FlatButton, Paper, TextField } from 'material-ui';

import './AddPostForm.css';

const AddPostFormDisplay = (props) => {
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
          label="Zu den Neuigkeiten auf dieser Seite hinzufügen"
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
          <FlatButton type="submit" label="Speichern" primary />
          <FlatButton label="Abbrechen" secondary onClick={props.onCancel} />
        </div>
      </Paper>
    </form>
  );
};

AddPostFormDisplay.defaultProps = {
  appearInNews: true,
  sendMailToSubscribers: true,
  sendMailToAll: false,

  titleError: '',
  contentError: '',
};

AddPostFormDisplay.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  appearInNews: PropTypes.bool,
  sendMailToSubscribers: PropTypes.bool,
  sendMailToAll: PropTypes.bool,

  titleError: PropTypes.string,
  contentError: PropTypes.string,

  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddPostFormDisplay;
