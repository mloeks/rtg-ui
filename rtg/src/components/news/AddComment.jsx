import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField } from 'material-ui';
import ContentSend from 'material-ui/svg-icons/content/send';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';
import { purple } from '../../theme/RtgTheme';

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
      author: AuthService.getUserId(),
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
    return (
      <Fragment>
        <form
          className="AddComment__form"
          onSubmit={this.postComment}
          noValidate
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            marginTop: '-10px',
            width: '100%',
          }}
        >
          <TextField
            name="content"
            floatingLabelText="Kommentar schreiben..."
            value={this.state.content}
            errorText={this.state.contentError}
            style={{ textAlign: 'left', flexGrow: 1 }}
            onChange={(e, content) =>
              this.setState({ content, contentError: '', savingError: false })}
          />
          <IconButton
            type="submit"
            disabled={this.state.saving || this.state.content.length === 0 ||
              this.state.contentError.length > 0}
            style={{ paddingRight: 0 }}
          ><ContentSend color={purple} />
          </IconButton>
        </form>

        {(this.state.savingError && this.state.content.length > 0) &&
          <Notification
            type={NotificationType.ERROR}
            dismissable
            title="Fehler beim Speichern"
            subtitle="Bitte versuche es erneut."
          />}
      </Fragment>
    );
  }
}

AddComment.defaultProps = {
  replyTo: null,
};

AddComment.propTypes = {
  postId: PropTypes.number.isRequired,
  replyTo: PropTypes.number,
  onAdded: PropTypes.func.isRequired,
};

export default AddComment;
