import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

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
    e.preventDefault();

    const newComment = {
      content: this.state.content,
      post: this.props.postId,
      reply_to: this.props.replyTo,
    };

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
            this.props.onAdded(response.json);
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
      <Fragment>
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
            dense
            error={Boolean(contentError)}
            fullWidth
            label={label}
            multiline
            name="content"
            value={content}
            helperText={contentError || false}
            onChange={e => this.setState({
              content: e.target.value, contentError: '', savingError: false,
            })}
            style={{ flexGrow: 1 }}
          />
          <Tooltip title="Kommentar abschicken">
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
          </Tooltip>
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
      </Fragment>
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
