import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentReply from 'material-ui/svg-icons/content/reply';
import { FlatButton } from 'material-ui';
import CommentsList from './CommentsList';
import { grey, lightGrey } from '../../theme/RtgTheme';

export const MAX_REPLY_DEPTH = 4;

// TODO P1 styling of comments
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = { showAddComment: false };
    this.toggleAddReply = this.toggleAddReply.bind(this);
    this.handleReplyAdded = this.handleReplyAdded.bind(this);
  }

  toggleAddReply() {
    this.setState(prevState => ({ showAddComment: !prevState.showAddComment }));
  }

  handleReplyAdded() {
    this.setState({ showAddComment: false });
  }

  render() {
    return (
      <div className="Comment">
        <div className="Comment_content" style={{ wordWrap: 'break-word' }}>
          {this.props.comment.content}
        </div>
        <div className="Comment_author">{this.props.comment.author_details.username}</div>
        <div className="Comment_avatar">{this.props.comment.author_details.avatar}</div>

        {this.props.hierarchyLevel <= MAX_REPLY_DEPTH && <FlatButton
          label="Antworten"
          icon={<ContentReply color={lightGrey} style={{ width: '18px' }} />}
          style={{ color: grey, fontSize: '12px' }}
          onClick={this.toggleAddReply}
        />}

        {this.props.hierarchyLevel <= MAX_REPLY_DEPTH && <CommentsList
          showAddComment={this.state.showAddComment}
          collapsed
          hierarchyLevel={this.props.hierarchyLevel + 1}
          postId={this.props.postId}
          commentCount={this.props.comment.no_replies}
          replyTo={this.props.comment.id}
          onReplyAdded={this.handleReplyAdded}
        />}
      </div>
    );
  }
}

Comment.propTypes = {
  hierarchyLevel: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
};

export default Comment;
