import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, FlatButton } from 'material-ui';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';
import Comment from './Comment';
import AddComment from './AddComment';

import './CommentsList.css';

class CommentsList extends Component {
  static getRepliesLabel(count) {
    if (count === 1) {
      return '1 Antwort';
    }
    return `${count} Antworten`;
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed,
      comments: [],
      loading: false,
      loadingError: false,
    };

    this.loadComments = this.loadComments.bind(this);
    this.handleCommentAdded = this.handleCommentAdded.bind(this);
  }

  componentDidMount() {
    if (!this.state.collapsed) {
      this.loadComments();
    }
  }

  async loadComments() {
    this.setState({ loading: true, collapsed: false });

    const commentFilterParam = this.props.replyTo ? `reply_to=${this.props.replyTo}` : 'toplevel=true';
    return fetch(`${API_BASE_URL}/rtg/comments/?post=${this.props.postId}&${commentFilterParam}`, {
      method: 'GET',
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    })
      .then(FetchHelper.parseJson)
      .then(response => (
        this.setState({
          loading: false,
          ...response.ok ? { comments: response.json.results } : { loadingError: true },
        })
      ))
      .catch(() => this.setState({ loading: false, loadingError: true }));
  }

  handleCommentAdded(comment) {
    // TODO P1 update comments/replies count (bubble up)
    this.setState((prevState) => {
      const newComments = prevState.comments.slice(0);
      newComments.push(comment);
      return { comments: newComments, collapsed: false };
    }, () => {
      this.props.onReplyAdded();
    });
  }

  render() {
    return (
      <div
        className={`CommentsList ${this.state.collapsed ? 'CommentsList--collapsed' : ''} ${this.props.hierarchyLevel === 0 ? 'CommentsList--top-level' : ''}`}
      >
        {this.state.loading &&
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={25} thickness={2} style={{ margin: '0 auto' }} />
          </div>}

        {(this.props.showAddComment && !this.state.loading) &&
          <AddComment
            postId={this.props.postId}
            replyTo={this.props.replyTo}
            onAdded={this.handleCommentAdded}
          />}

        {(this.state.collapsed && this.props.commentCount > 0) &&
          <FlatButton
            className="CommentsList__load-more-replies"
            label={CommentsList.getRepliesLabel(this.props.commentCount)}
            onClick={this.loadComments}
          />}

        {(!this.state.loading && !this.state.collapsed && !this.state.loadingError) &&
          this.state.comments.map(comment => (
            <Comment
              key={`comment-${comment.id}`}
              hierarchyLevel={this.props.hierarchyLevel}
              postId={this.props.postId}
              comment={comment}
            />))
        }

        {this.state.loadingError &&
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden"
            subtitle="Bitte versuche es erneut."
          />}
      </div>
    );
  }
}

CommentsList.defaultProps = {
  collapsed: false,
  replyTo: null,
  showAddComment: false,
  onReplyAdded: () => {},
};

CommentsList.propTypes = {
  collapsed: PropTypes.bool,
  commentCount: PropTypes.number.isRequired,
  hierarchyLevel: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  replyTo: PropTypes.number,
  showAddComment: PropTypes.bool,
  onReplyAdded: PropTypes.func,
};

export default CommentsList;
