import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { RaisedButton, TextField } from 'material-ui';

const ContactFormPresentational = props => (
  <Fragment>
    <TextField
      name="author"
      floatingLabelText="Dein Name"
      fullWidth
      value={props.author}
      errorText={props.authorError}
      style={{ textAlign: 'left' }}
      onChange={(e, v) => props.onFieldChange('author', v)}
    /><br />
    <TextField
      name="email"
      floatingLabelText="Deine E-Mail Adresse"
      fullWidth
      value={props.email}
      errorText={props.emailError}
      style={{ textAlign: 'left' }}
      onChange={(e, v) => props.onFieldChange('email', v)}
    /><br />
    <TextField
      name="content"
      floatingLabelText="Nachricht an das Königshaus"
      fullWidth
      multiLine
      rows={5}
      value={props.content}
      errorText={props.contentError}
      style={{ textAlign: 'left' }}
      onChange={(e, v) => props.onFieldChange('content', v)}
    /><br />

    <RaisedButton
      label={props.isSaving ? 'Unterwegs...' : 'Zur Post geben'}
      type="submit"
      primary
      disabled={props.isSaving || props.formHasErrors}
      style={{ width: 200, margin: '30px auto' }}
    />
  </Fragment>
);

ContactFormPresentational.defaultProps = {
  author: '',
  email: '',
  content: '',
};

ContactFormPresentational.propTypes = {
  author: PropTypes.string,
  email: PropTypes.string,
  content: PropTypes.string,

  authorError: PropTypes.string,
  emailError: PropTypes.string,
  contentError: PropTypes.string,

  isSaving: PropTypes.bool.isRequired,
  formHasErrors: PropTypes.bool.isRequired,

  onFieldChange: PropTypes.func.isRequired,
};

export default ContactFormPresentational;
