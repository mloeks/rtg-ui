import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parseISO } from 'date-fns';

import Button from '@material-ui/core/Button';
import CommentsList from './CommentsList';
import UserAvatar from '../UserAvatar';
import { getFormattedPostDate } from './Post';
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
      replies,
    } = this.props;

    return (
      <div className="Comment">
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
            <Button
              size="small"
              color="primary"
              style={{ marginLeft: 42 }}
              onClick={this.toggleAddReply}
            >
              Antworten
            </Button>
          )}
        </div>

        {hierarchyLevel <= MAX_REPLY_DEPTH && (
          <CommentsList
            showAddComment={showAddComment}
            collapsed={hierarchyLevel > 0}
            hierarchyLevel={hierarchyLevel + 1}
            postId={postId}
            comments={replies}
            commentCount={comment.no_replies}
            replyTo={comment.id}
            onReplyAdded={this.handleReplyAdded}
          />
        )}
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
    no_replies: PropTypes.number.isRequired,
    reply_to: PropTypes.number.isRequired,
  }).isRequired,

  replies: PropTypes.instanceOf(Array),
  onReplyAdded: PropTypes.func,
};

export default Comment;
