import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';
import Comment from './Comment';

import './CommentsList.scss';

class CommentsList extends Component {
  static getRepliesLabel(count) {
    if (count === 1) {
      return '1 weitere Antwort anzeigen';
    }
    return `${count} weitere Antworten anzeigen`;
  }

  static mapComments(flatComments) {
    const mappedComments = flatComments.slice(0);

    for (let i = 0; i < mappedComments.length; i += 1) {
      mappedComments[i].replies = mappedComments.filter((c) => c.reply_to === mappedComments[i].id);
    }
    return mappedComments.filter((c) => !c.reply_to);
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed,
      comments: [],
      loading: true,
      loadingError: false,
    };

    this.handleCommentAdded = this.handleCommentAdded.bind(this);
    this.findCommentById = this.findCommentById.bind(this);
    this.loadComments = this.loadComments.bind(this);
  }

  componentDidMount() {
    this.loadComments();
  }

  componentDidUpdate(prevProps) {
    const { shouldUpdate } = this.props;
    if (shouldUpdate && !prevProps.shouldUpdate) {
      this.loadComments();
    }
  }

  handleCommentAdded(newComment) {
    const { onCommentAdded } = this.props;
    this.setState((prevState) => {
      let comments = [];
      comments = prevState.comments.slice(0);
      const replyToComment = this.findCommentById(comments, newComment.reply_to);
      if (replyToComment) {
        if (!replyToComment.replies) {
          replyToComment.replies = [];
        }
        replyToComment.replies.push(newComment);
      } else {
        comments.push(newComment);
      }
      return { comments };
    }, onCommentAdded);
  }

  findCommentById(comments, commentId) {
    for (let i = 0; i < comments.length; i += 1) {
      const c = comments[i];
      if (c.id === commentId) {
        return c;
      }
      const matchingReply = this.findCommentById(c.replies, commentId);
      if (matchingReply) {
        return matchingReply;
      }
    }
    return null;
  }

  async loadComments() {
    const { postId } = this.props;

    return fetch(`${API_BASE_URL}/rtg/comments/?post=${postId}`, {
      method: 'GET',
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    })
      .then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          this.setState({
            loading: false,
            comments: CommentsList.mapComments(response.json.results),
          });
        } else {
          this.setState({ loading: false, loadingError: true });
        }
      })
      .catch(() => this.setState({ loading: false, loadingError: true }));
  }

  render() {
    const { postId } = this.props;
    const {
      collapsed,
      comments,
      loading,
      loadingError,
    } = this.state;

    return (
      <div
        className={`CommentsList ${collapsed ? 'CommentsList--collapsed' : ''}`}
      >
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={25} thickness={2} style={{ margin: '0 auto' }} />
          </div>
        )}

        {(!loading && !collapsed && !loadingError) && (
          comments.map((c) => (
            <Comment
              key={`comment-${c.id}`}
              hierarchyLevel={0}
              postId={postId}
              comment={c}
              onReplyAdded={this.handleCommentAdded}
            />
          ))
        )}

        {loadingError && (
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden"
            subtitle="Bitte versuche es erneut."
          />
        )}
      </div>
    );
  }
}

CommentsList.defaultProps = {
  collapsed: false,
  onCommentAdded: () => {},
  shouldUpdate: false,
};

CommentsList.propTypes = {
  collapsed: PropTypes.bool,
  onCommentAdded: PropTypes.func,
  postId: PropTypes.number.isRequired,
  shouldUpdate: PropTypes.bool,
};

export default CommentsList;
