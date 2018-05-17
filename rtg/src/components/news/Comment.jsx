import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatButton } from 'material-ui';
import CommentsList from './CommentsList';
import { lightGrey } from '../../theme/RtgTheme';
import UserAvatar from '../UserAvatar';
import { getFormattedPostDate } from './Post';

import './Comment.css';

export const MAX_REPLY_DEPTH = 4;

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
    this.setState({ showAddComment: false }, this.props.onReplyAdded);
  }

  render() {
    return (
      <div className="Comment">
        <div className="Comment__avatar-content-wrapper">
          <div className="Comment__avatar">
            <UserAvatar
              size={40}
              username={this.props.comment.author_details.username}
              img={this.props.comment.author_details.avatar}
            />
          </div>
          <div>
            <div className="Comment__author-date">
              <span className="Comment__author">
                {this.props.comment.author_details.username} –&nbsp;
              </span>
              <span>{getFormattedPostDate(this.props.comment.date_created)}</span>
            </div>
            <div className="Comment__content">{this.props.comment.content}</div>
          </div>
        </div>

        <div className="Comment__actions">
          {this.props.hierarchyLevel <= MAX_REPLY_DEPTH && <FlatButton
            label="Antworten"
            labelPosition="after"
            style={{
              color: lightGrey,
              height: '24px',
              lineHeight: '24px',
              marginLeft: '35px',
            }}
            labelStyle={{ fontSize: '12px', fontWeight: 400 }}
            onClick={this.toggleAddReply}
          />}
        </div>

        {this.props.hierarchyLevel <= MAX_REPLY_DEPTH && <CommentsList
          showAddComment={this.state.showAddComment}
          collapsed={this.props.hierarchyLevel > 0}
          hierarchyLevel={this.props.hierarchyLevel + 1}
          postId={this.props.postId}
          comments={this.props.replies}
          commentCount={this.props.comment.no_replies}
          replyTo={this.props.comment.id}
          onReplyAdded={this.handleReplyAdded}
        />}
      </div>
    );
  }
}

Comment.defaultProps = {
  replies: [],
  onReplyAdded: () => {},
};

Comment.propTypes = {
  hierarchyLevel: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  replies: PropTypes.array,
  onReplyAdded: PropTypes.func,
};

export default Comment;
