import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const ContactFormPresentational = ({
  author, authorError, content, contentError, email, emailError, formHasErrors,
  isSaving, onFieldChange,
}) => (
  <Fragment>
    <TextField
      error={Boolean(authorError)}
      name="author"
      label="Dein Name"
      fullWidth
      value={author}
      helperText={authorError}
      style={{ textAlign: 'left' }}
      onChange={e => onFieldChange('author', e.target.value)}
    />
    <br />
    <br />
    <TextField
      error={Boolean(emailError)}
      name="email"
      label="Deine E-Mail Adresse"
      fullWidth
      value={email}
      helperText={emailError}
      style={{ textAlign: 'left' }}
      onChange={e => onFieldChange('email', e.target.value)}
    />
    <br />
    <br />
    <TextField
      error={Boolean(contentError)}
      name="content"
      label="Nachricht an das Königshaus"
      fullWidth
      multiline
      rows={5}
      value={content}
      helperText={contentError}
      style={{ textAlign: 'left' }}
      onChange={e => onFieldChange('content', e.target.value)}
    />
    <br />

    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSaving || formHasErrors}
      style={{ width: 200, margin: '30px auto 10px' }}
    >
      {isSaving ? 'Unterwegs...' : 'Zur Post geben'}
    </Button>
  </Fragment>
);

ContactFormPresentational.defaultProps = {
  author: '',
  email: '',
  content: '',

  authorError: null,
  emailError: null,
  contentError: null,
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
