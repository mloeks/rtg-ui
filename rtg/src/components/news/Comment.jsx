import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentReply from 'material-ui/svg-icons/content/reply';
import { FlatButton } from 'material-ui';
import CommentsList from './CommentsList';
import { grey, lightGrey } from '../../theme/RtgTheme';

// TODO P1 styling of comments
class Comment extends Component {
  static getRepliesLabel(noReplies) {
    if (noReplies === 0) {
      return 'Antworten';
    }
    if (noReplies === 1) {
      return '1 Antwort';
    }
    return `${noReplies} Antworten`;
  }

  constructor(props) {
    super(props);
    this.state = { expandReplies: false };
    this.toggleReplies = this.toggleReplies.bind(this);
  }

  toggleReplies() {
    this.setState(prevState => ({ expandReplies: !prevState.expandReplies }));
  }

  render() {
    return (
      <div className="Comment">
        <div className="Comment_content" style={{ wordWrap: 'break-word' }}>
          {this.props.comment.content}
          </div>
        <div className="Comment_author">{this.props.comment.author_details.username}</div>
        <div className="Comment_avatar">{this.props.comment.author_details.avatar}</div>

        <FlatButton
          label={Comment.getRepliesLabel(this.props.comment.no_replies)}
          icon={<ContentReply color={lightGrey} style={{ width: '18px' }} />}
          style={{ color: grey, fontSize: '12px' }}
          onClick={this.toggleReplies}
        />

        {this.state.expandReplies &&
          <CommentsList postId={this.props.postId} replyTo={this.props.comment.id} />}
      </div>
    );
  }
}

Comment.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
};

export default Comment;
