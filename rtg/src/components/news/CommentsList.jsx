import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';
import Comment from './Comment';
import AddComment from './AddComment';

// TODO P1 indent sub-lists
// TODO P1 allow maximum of x (5?) nested replies
class CommentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      loadingError: false,
    };

    this.handleCommentAdded = this.handleCommentAdded.bind(this);
  }

  async componentDidMount() {
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
      return { comments: newComments };
    });
  }

  render() {
    return (
      <div className="CommentsList">
        {this.state.loading &&
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={25} thickness={2} style={{ margin: '0 auto' }} />
          </div>}

        {this.props.collapsed && <div>TODO Antworten zeigen</div>}

        {(!this.state.loading && !this.props.collapsed) && this.state.comments.map(comment =>
          <Comment key={`comment-${comment.id}`} postId={this.props.postId} comment={comment} />)}

        {this.props.showAddComment &&
          <AddComment postId={this.props.postId} onAdded={this.handleCommentAdded} />}

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
};

CommentsList.propTypes = {
  collapsed: PropTypes.bool,
  postId: PropTypes.number.isRequired,
  replyTo: PropTypes.number,
  showAddComment: PropTypes.bool,
};

export default CommentsList;
