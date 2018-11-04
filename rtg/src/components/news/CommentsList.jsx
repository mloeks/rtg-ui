import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Notification, { NotificationType } from '../Notification';
import Comment from './Comment';
import AddComment from './AddComment';

import './CommentsList.scss';

const styles = theme => ({
  loadMoreRepliesButton: {
    backgroundColor: theme.palette.grey['200'],
    minHeight: 24,
    padding: 0,
  },
  loadMoreRepliesLabel: {
    color: theme.palette.grey['600'],
    fontSize: 11,
  },
});

class CommentsList extends Component {
  static getRepliesLabel(count) {
    if (count === 1) {
      return '1 weitere Antwort anzeigen';
    }
    return `${count} weitere Antworten anzeigen`;
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed,
      loading: false,
      loadingError: false,
    };

    this.loadComments = this.loadComments.bind(this);
    this.handleCommentAdded = this.handleCommentAdded.bind(this);
  }

  componentDidMount() {
    const { comments } = this.props;
    if (comments.length === 0) { this.loadComments(); }
  }

  async loadComments() {
    const { onCommentsLoaded, postId } = this.props;
    this.setState({ loading: true, collapsed: false });

    return fetch(`${API_BASE_URL}/rtg/comments/?post=${postId}`, {
      method: 'GET',
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    })
      .then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          onCommentsLoaded(response.json.results);
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false, loadingError: true });
        }
      })
      .catch(() => this.setState({ loading: false, loadingError: true }));
  }

  handleCommentAdded(comment) {
    const { onReplyAdded } = this.props;
    this.setState({ collapsed: false }, () => { onReplyAdded(comment); });
  }

  render() {
    const {
      classes,
      comments,
      commentCount,
      hierarchyLevel,
      onReplyAdded,
      postId,
      replyTo,
      showAddComment,
    } = this.props;
    const { collapsed, loading, loadingError } = this.state;

    // TODO P3 is being re-rendered 2*comment count times when post comments are only toggled?!
    const displayComments = hierarchyLevel === 0
      ? comments.filter(c => !c.reply_to)
      : comments.filter(c => c.reply_to === replyTo);

    return (
      <div
        className={`CommentsList ${collapsed ? 'CommentsList--collapsed' : ''} ${hierarchyLevel === 0 ? 'CommentsList--top-level' : ''}`}
      >
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={25} thickness={2} style={{ margin: '0 auto' }} />
          </div>
        )}

        {(showAddComment && !loading) && (
          <Fragment>
            <AddComment
              label="Antwort hinzufügen..."
              postId={postId}
              replyTo={replyTo}
              onAdded={this.handleCommentAdded}
            />
            <br />
          </Fragment>
        )}

        {(collapsed && commentCount > 0) && (
          <Button
            size="small"
            className="CommentsList__load-more-replies"
            classes={{ root: classes.loadMoreRepliesButton, label: classes.loadMoreRepliesLabel }}
            fullWidth
            onClick={() => this.setState({ collapsed: false })}
          >
            {CommentsList.getRepliesLabel(commentCount)}
          </Button>
        )}

        {(!loading && !collapsed && !loadingError) && (
          displayComments.map(c => (
            <Comment
              key={`comment-${c.id}`}
              hierarchyLevel={hierarchyLevel}
              postId={postId}
              comment={c}
              replies={comments}
              onReplyAdded={onReplyAdded}
            />))
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
  comments: [],
  replyTo: null,
  showAddComment: false,
  onCommentsLoaded: () => {},
  onReplyAdded: () => {},
};

CommentsList.propTypes = {
  collapsed: PropTypes.bool,
  comments: PropTypes.arrayOf(PropTypes.object),
  commentCount: PropTypes.number.isRequired,
  hierarchyLevel: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  replyTo: PropTypes.number,
  showAddComment: PropTypes.bool,
  onCommentsLoaded: PropTypes.func,
  onReplyAdded: PropTypes.func,

  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(CommentsList);
