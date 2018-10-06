import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ModeCommentIcon from '@material-ui/icons/ModeComment';

import {
  differenceInMinutes,
  differenceInSeconds,
  distanceInWordsStrict,
  format,
  isToday,
  isYesterday,
} from 'date-fns';
import de from 'date-fns/locale/de';

import UserAvatar from '../UserAvatar';
import CommentsList from './CommentsList';
import { randomHueHexColor } from '../../service/ColorHelper';
import AddComment from './AddComment';
import UserDetailsPopover from '../UserDetailsPopover';

import './Post.css';

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

export const getFormattedPostDate = (date) => {
  const now = new Date();

  if (differenceInSeconds(now, date) < 60) {
    return 'Gerade eben';
  }
  if (differenceInMinutes(now, date) < 60) {
    return distanceInWordsStrict(now, date, { locale: de, addSuffix: true, unit: 'm' });
  }

  const formattedTime = format(date, 'HH:mm [Uhr]');
  if (isToday(date)) { return `Heute, ${formattedTime}`; }
  if (isYesterday(date)) { return `Gestern, ${formattedTime}`; }

  return `${format(date, 'dd. D. MMMM', { locale: de })}, ${formattedTime}`;
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
      <Fragment>
        <span className="Post__comments-label-mobile">{noComments}</span>
        <span className="Post__comments-label-desktop">{desktopLabel}</span>
      </Fragment>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      comments: [],
      commentCount: props.post.no_comments || 0,
      contentWrappedForLength: false,
      userDetailsPopoverAnchorEl: null,
      userDetailsPopoverOpen: false,
    };

    this.contentRef = React.createRef();
    this.randomPostColour = randomHueHexColor(40, 90);

    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.showAllContent = this.showAllContent.bind(this);
    this.showUserDetailsPopover = this.showUserDetailsPopover.bind(this);
    this.hideUserDetailsPopover = this.hideUserDetailsPopover.bind(this);
    this.handleCommentAdded = this.handleCommentAdded.bind(this);
    this.getCommentCountIncrementedBy = this.getCommentCountIncrementedBy.bind(this);
  }

  componentDidMount() {
    const { wrapFromHeight } = this.props;
    const shouldWrapLongContent = this.contentRef.current.clientHeight > wrapFromHeight;
    this.setState({ contentWrappedForLength: shouldWrapLongContent });
  }

  getCommentCountIncrementedBy(inc, state = this.state) {
    return state.commentCount + 1;
  }

  toggleExpanded() {
    this.setState((prevState) => {
      const expanded = !prevState.expanded;
      if (expanded) {
        // force reloading of comments when expanding
        return { comments: [], expanded };
      }
      return { expanded };
    });
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

  handleCommentAdded(newComment) {
    this.setState((prevState) => {
      let comments = [];
      if (prevState.expanded) {
        // only directly update comments if comments area is already visible
        // otherwise they should be initially loaded (add comment when not yet visible)
        comments = prevState.comments.slice(0);
        const replyToIndex = comments.findIndex(c => c.id === newComment.reply_to);
        if (replyToIndex !== -1) {
          comments[replyToIndex].no_replies += 1;
        }
        comments.push(newComment);
      }
      return {
        expanded: true,
        comments,
        commentCount: this.getCommentCountIncrementedBy(1, prevState),
      };
    });
  }

  render() {
    const {
      comments,
      commentCount,
      contentWrappedForLength,
      expanded,
      userDetailsPopoverAnchorEl,
      userDetailsPopoverOpen,
    } = this.state;
    const { classes, post, theme } = this.props;

    const dateCreated = new Date(post.date_created);

    return (
      <Card
        className="Post__card"
        expanded={expanded}
        containerStyle={{ paddingBottom: 0 }}
      >
        <CardHeader
          className="Post__card-title"
          classes={{ title: classes.headline }}
          title={post.title}
          titleTypographyProps={{ color: 'textPrimary', component: 'h2', variant: 'headline' }}
          style={{ backgroundColor: this.randomPostColour }}
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
              dangerouslySetInnerHTML={{ __html: post.content }}
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
              </div>)}
          </CardContent>
        )}

        <CardHeader
          className="Post__author-and-comments"
          classes={{ title: classes.authorTitle }}
          title={post.author_details.username}
          subheader={`${getFormattedPostDate(dateCreated)}`}
          avatar={(
            <Fragment>
              <UserAvatar
                className="Post__author-avatar"
                size={40}
                img={post.author_details.avatar}
                username={post.author_details.username}
                onClick={this.showUserDetailsPopover}
                style={{ left: 0, top: 0 }}
              />
              <UserDetailsPopover
                anchorEl={userDetailsPopoverAnchorEl}
                avatar={post.author_details.avatar}
                userId={post.author_details.pk}
                username={post.author_details.username}
                open={userDetailsPopoverOpen}
                onClose={this.hideUserDetailsPopover}
              />
            </Fragment>
          )}
          action={(
            <Button
              disabled={commentCount === 0}
              onClick={this.toggleExpanded}
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
            onAdded={this.handleCommentAdded}
          />
        </CardActions>

        <Collapse in={expanded} unmountOnExit>
          <CardContent className="Post__comments" expandable style={{ paddingBottom: 8 }}>
            <CommentsList
              hierarchyLevel={0}
              postId={post.id}
              comments={comments}
              commentCount={commentCount}
              onReplyAdded={this.handleCommentAdded}
              onCommentsLoaded={loadedComments => this.setState({ comments: loadedComments })}
            />
            <div style={{ textAlign: 'center' }}>
              <Button color="secondary" size="small" onClick={this.toggleExpanded}>
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

  /* eslint-disable react/forbid-prop-types */
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default withStyles(styles)(withTheme()(Post));
