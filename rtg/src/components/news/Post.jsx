import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

import { withStyles, withTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';

import KeyboardArrowDownIcon from '@mui/icons/KeyboardArrowDown';
import ModeCommentIcon from '@mui/icons/ModeComment';

import UserAvatar from '../UserAvatar';
import CommentsList from './CommentsList';
import getFormattedPostDate from '../../service/PostUtils';
import AddComment from './AddComment';
import UserDetailsPopover from '../UserDetailsPopover';

import './Post.scss';

const styles = {
  headline: {
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },
  authorTitle: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};

class Post extends Component {
  static getCommentsLabel(noComments) {
    let desktopLabel;
    if (noComments === 1) {
      desktopLabel = '1 Kommentar';
    } else {
      desktopLabel = `${noComments} Kommentare`;
    }
    return (
      <>
        <span className="Post__comments-label-mobile">{noComments}</span>
        <span className="Post__comments-label-desktop">{desktopLabel}</span>
      </>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      commentsExpanded: false,
      commentCount: props.post.no_comments || 0,
      contentWrappedForLength: false,
      shouldCommentListUpdate: false,
      userDetailsPopoverAnchorEl: null,
      userDetailsPopoverOpen: false,
    };

    this.contentRef = React.createRef();

    this.handleCommentAdded = this.handleCommentAdded.bind(this);
    this.handleTopLevelCommentAdded = this.handleTopLevelCommentAdded.bind(this);
    this.toggleCommentsExpanded = this.toggleCommentsExpanded.bind(this);
    this.showAllContent = this.showAllContent.bind(this);
    this.showUserDetailsPopover = this.showUserDetailsPopover.bind(this);
    this.hideUserDetailsPopover = this.hideUserDetailsPopover.bind(this);
  }

  componentDidMount() {
    const { wrapFromHeight } = this.props;
    const shouldWrapLongContent = this.contentRef.current.clientHeight > wrapFromHeight;
    this.setState({ contentWrappedForLength: shouldWrapLongContent });
  }

  handleCommentAdded() {
    this.setState((prevState) => ({ commentCount: prevState.commentCount + 1 }));
  }

  handleTopLevelCommentAdded() {
    const { commentsExpanded } = this.state;
    this.setState({ shouldCommentListUpdate: commentsExpanded, commentsExpanded: true }, () => {
      this.setState({ shouldCommentListUpdate: false });
      this.handleCommentAdded();
    });
  }

  toggleCommentsExpanded() {
    this.setState((prevState) => ({ commentsExpanded: !prevState.commentsExpanded }));
  }

  showAllContent() {
    this.setState({ contentWrappedForLength: false });
  }

  showUserDetailsPopover(e) {
    e.preventDefault();
    this.setState({ userDetailsPopoverOpen: true, userDetailsPopoverAnchorEl: e.currentTarget });
  }

  hideUserDetailsPopover() {
    this.setState({ userDetailsPopoverOpen: false });
  }

  render() {
    const {
      commentCount,
      contentWrappedForLength,
      commentsExpanded,
      shouldCommentListUpdate,
      userDetailsPopoverAnchorEl,
      userDetailsPopoverOpen,
    } = this.state;
    const { classes, post, theme } = this.props;

    const dateCreated = new Date(post.date_created);

    return (
      <Card className="Post__card qa-post">
        <CardHeader
          className="Post__card-title qa-post-title"
          classes={{ title: classes.headline }}
          title={post.title}
          titleTypographyProps={{ color: 'textPrimary', variant: 'h4' }}
        />

        {post && (
          <CardContent
            className={`Post__content ${contentWrappedForLength ? 'Post__content--wrapped' : ''}`}
            style={{
              backgroundColor: 'white',
              fontSize: '16px',
            }}
          >
            <div
              className="qa-post-content"
              // Even though the Post content can only be entered by admins,
              // let's still send it through a sanitizer in order to prevent XSS
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              ref={this.contentRef}
              style={{
                margin: 0,
                fontFamily: '"Roboto", sans-serif',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            />
            {contentWrappedForLength && (
              <div className="Post__content-show-all">
                <Button color="primary" size="small" onClick={this.showAllContent}>
                  <KeyboardArrowDownIcon />
                  Alles lesen
                  <KeyboardArrowDownIcon />
                </Button>
              </div>
            )}
          </CardContent>
        )}

        <CardHeader
          className="Post__author-and-comments"
          classes={{ title: classes.authorTitle }}
          title={post.author_details.username}
          subheader={`${getFormattedPostDate(dateCreated)}`}
          avatar={(
            <>
              <UserAvatar
                className="Post__author-avatar"
                size={40}
                img={post.author_details.avatar}
                username={post.author_details.username}
                onClick={this.showUserDetailsPopover}
                style={{ left: 0, top: 0 }}
              />
              {userDetailsPopoverOpen && userDetailsPopoverAnchorEl && (
                <UserDetailsPopover
                  anchorEl={userDetailsPopoverAnchorEl}
                  avatar={post.author_details.avatar}
                  userId={post.author_details.pk}
                  username={post.author_details.username}
                  onClose={this.hideUserDetailsPopover}
                />
              )}
            </>
          )}
          action={(
            <Button
              disabled={commentCount === 0}
              onClick={this.toggleCommentsExpanded}
              style={{
                color: theme.palette.grey['500'],
                lineHeight: 'inherit',
                margin: 0,
                right: 0,
                top: '10px',
                minWidth: '10px',
                width: 'auto',
              }}
            >
              {Post.getCommentsLabel(commentCount)}
              <ModeCommentIcon style={{ width: '20px', marginLeft: 8 }} />
            </Button>
          )}
          style={{ padding: '16px' }}
        />
        <CardActions className="Post__add-comment" style={{ padding: '0 16px 16px', marginTop: -10 }}>
          <AddComment
            focusOnMount={false}
            postId={post.id}
            onAdded={this.handleTopLevelCommentAdded}
          />
        </CardActions>

        <Collapse in={commentsExpanded} unmountOnExit>
          <CardContent className="Post__comments" style={{ paddingBottom: 8 }}>
            <CommentsList
              postId={post.id}
              shouldUpdate={shouldCommentListUpdate}
              onCommentAdded={this.handleCommentAdded}
            />
            <div style={{ textAlign: 'center' }}>
              <Button color="secondary" size="small" onClick={this.toggleCommentsExpanded}>
                Zuklappen
              </Button>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

Post.defaultProps = {
  // keep this in sync with the CSS max-height prop in Post.scss!
  wrapFromHeight: 300,
};

Post.propTypes = {
  wrapFromHeight: PropTypes.number,
  post: PropTypes.shape().isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(withTheme(Post));
