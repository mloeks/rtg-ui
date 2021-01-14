import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import SendIcon from '@material-ui/icons/Send';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';

class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      contentError: '',

      saving: false,
      savingError: false,
    };

    this.postComment = this.postComment.bind(this);
  }

  async postComment(e) {
    const { content } = this.state;
    const { onAdded, postId, replyTo } = this.props;

    e.preventDefault();

    const newComment = { content, post: postId, reply_to: replyTo };

    return fetch(`${API_BASE_URL}/rtg/comments/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${AuthService.getToken()}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(newComment),
    })
      .then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          this.setState({ saving: false, content: '' }, () => {
            onAdded(response.json);
          });
        } else {
          this.setState({
            saving: false,
            savingError: true,
            contentError: response.json.content && response.json.content[0],
          });
        }
      })
      .catch(() => this.setState({ saving: false, savingError: true }));
  }

  render() {
    const {
      content,
      contentError,
      saving,
      savingError,
    } = this.state;
    const { focusOnMount, label } = this.props;

    return (
      <>
        <form
          className="AddComment__form"
          onSubmit={this.postComment}
          noValidate
          autoComplete="off"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <TextField
            autoFocus={focusOnMount}
            error={Boolean(contentError)}
            fullWidth
            label={label}
            multiline
            name="content"
            value={content}
            helperText={contentError || false}
            onChange={(e) => this.setState({
              content: e.target.value, contentError: '', savingError: false,
            })}
            style={{ flexGrow: 1 }}
          />
          <IconButton
            aria-label="Kommentar abschicken"
            color="primary"
            type="submit"
            size="small"
            disabled={saving || content.length === 0 || contentError.length > 0}
            style={{ height: 32, width: 32, marginLeft: 8 }}
          >
            <SendIcon />
          </IconButton>
        </form>

        {(savingError && content.length > 0)
          && (
            <Notification
              type={NotificationType.ERROR}
              dismissable
              title="Fehler beim Speichern"
              subtitle="Bitte versuche es erneut."
            />
          )}
      </>
    );
  }
}

AddComment.defaultProps = {
  focusOnMount: true,
  label: 'Kommentar hinzufügen...',
  replyTo: null,
};

AddComment.propTypes = {
  focusOnMount: PropTypes.bool,
  label: PropTypes.string,
  postId: PropTypes.number.isRequired,
  replyTo: PropTypes.number,
  onAdded: PropTypes.func.isRequired,
};

export default AddComment;
