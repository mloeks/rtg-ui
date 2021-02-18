import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parseISO } from 'date-fns';

import Button from '@material-ui/core/Button';

import AddComment from './AddComment';
import UserAvatar from '../UserAvatar';
import getFormattedPostDate from '../../service/PostUtils';
import UserDetailsPopover from '../UserDetailsPopover';

import './Comment.scss';

export const MAX_REPLY_DEPTH = 4;

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddComment: false,
      userDetailsPopoverAnchorEl: null,
      userDetailsPopoverOpen: false,
    };

    this.toggleAddReply = this.toggleAddReply.bind(this);
    this.handleReplyAdded = this.handleReplyAdded.bind(this);
    this.showUserDetailsPopover = this.showUserDetailsPopover.bind(this);
    this.hideUserDetailsPopover = this.hideUserDetailsPopover.bind(this);
  }

  handleReplyAdded(comment) {
    const { onReplyAdded } = this.props;
    this.setState({ showAddComment: false }, onReplyAdded(comment));
  }

  showUserDetailsPopover(e) {
    e.preventDefault();
    this.setState({ userDetailsPopoverOpen: true, userDetailsPopoverAnchorEl: e.currentTarget });
  }

  hideUserDetailsPopover() {
    this.setState({ userDetailsPopoverOpen: false });
  }

  toggleAddReply() {
    this.setState((prevState) => ({ showAddComment: !prevState.showAddComment }));
  }

  render() {
    const { userDetailsPopoverAnchorEl, userDetailsPopoverOpen, showAddComment } = this.state;
    const {
      comment,
      hierarchyLevel,
      postId,
    } = this.props;

    return (
      <div className={`Comment ${hierarchyLevel === 0 ? 'Comment--top-level' : ''}`}>
        <div className="Comment__avatar-content-wrapper">
          <div className="Comment__avatar">
            {userDetailsPopoverOpen && userDetailsPopoverAnchorEl && (
              <UserDetailsPopover
                anchorEl={userDetailsPopoverAnchorEl}
                avatar={comment.author_details.avatar}
                userId={comment.author_details.pk}
                username={comment.author_details.username}
                onClose={this.hideUserDetailsPopover}
              />
            )}

            <UserAvatar
              size={40}
              username={comment.author_details.username}
              img={comment.author_details.avatar}
              onClick={this.showUserDetailsPopover}
            />
          </div>
          <div>
            <div className="Comment__author-date">
              <span className="Comment__author">
                {comment.author_details.username}
&nbsp;–&nbsp;
              </span>
              <span>{getFormattedPostDate(parseISO(comment.date_created))}</span>
            </div>
            <pre className="Comment__content">{comment.content}</pre>
          </div>
        </div>

        <div className="Comment__actions">
          {hierarchyLevel <= MAX_REPLY_DEPTH && (
            <>
              <Button
                size="small"
                color="primary"
                onClick={this.toggleAddReply}
              >
                Antworten
              </Button>

              {showAddComment && (
                <AddComment
                  label="Antwort hinzufügen..."
                  postId={postId}
                  replyTo={comment.id}
                  onAdded={this.handleReplyAdded}
                />
              )}
            </>
          )}
        </div>

        {hierarchyLevel <= MAX_REPLY_DEPTH && comment.replies && comment.replies.map((reply) => (
          <Comment
            key={`comment-${reply.id}`}
            showAddComment={showAddComment}
            hierarchyLevel={hierarchyLevel + 1}
            postId={postId}
            comment={reply}
            onReplyAdded={this.handleReplyAdded}
          />
        ))}
      </div>
    );
  }
}

Comment.defaultProps = {
  onReplyAdded: () => {},
};

Comment.propTypes = {
  hierarchyLevel: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,

  // TODO P3 introduce dedicated DTO class for comments, then validate
  // for instanceOf(Comment) here (for props comment & replies)
  comment: PropTypes.shape({
    author_details: PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      pk: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    date_created: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    replies: PropTypes.arrayOf(PropTypes.shape()),
    reply_to: PropTypes.number,
  }).isRequired,

  onReplyAdded: PropTypes.func,
};

export default Comment;
