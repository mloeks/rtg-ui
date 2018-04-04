import React from 'react';
import PropTypes from 'prop-types';
import { FlatButton, TextField } from 'material-ui';

const AddPostFormDisplay = (props) => {
  return (
    <form className="AddPostForm" noValidate>
      <TextField
        floatingLabelText="Titel"
        value={props.title}
        fullWidth
        errorText={props.titleError}
        onChange={(e, v) => props.onFieldChange('title', v)}
      />
      <FlatButton type="submit" label="Speichern" primary onClick={props.onSubmit} />
    </form>
  );
};

AddPostFormDisplay.propTypes = {
  title: PropTypes.string.isRequired,
  titleError: PropTypes.string.isRequired,

  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddPostFormDisplay;
