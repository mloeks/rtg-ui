import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardText, CardTitle, FlatButton, ListItem } from 'material-ui';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import EditorModeComment from 'material-ui/svg-icons/editor/mode-comment';
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
import { grey, lightGrey } from '../../theme/RtgTheme';
import AddComment from './AddComment';
import UserDetailsPopover from '../UserDetailsPopover';

import './Post.css';

export const getFormattedPostDate = (date) => {
  const now = new Date();

  if (differenceInSeconds(now, date) < 60) {
    return 'Gerade eben';
  }
  if (differenceInMinutes(now, date) < 60) {
    return distanceInWordsStrict(now, date, { locale: de, addSuffix: true, unit: 'm' });
  }

  const formattedTime = format(date, 'HH:mm [Uhr]');
  if (isToday(date)) {
    return `Heute, ${formattedTime}`;
  } else if (isYesterday(date)) {
    return `Gestern, ${formattedTime}`;
  }

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
    const shouldWrapLongContent = this.contentRef.current.clientHeight > this.props.wrapFromHeight;
    this.setState({ contentWrappedForLength: shouldWrapLongContent });
  }

  getCommentCountIncrementedBy(inc, state = this.state) {
    return state.commentCount + 1;
  }

  toggleExpanded() {
    this.setState(prevState => {
      const expanded = !prevState.expanded;
      if (expanded) {
        // force reloading of comments when expanded
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

  handleCommentAdded(comment) {
    this.setState((prevState) => {
      const updatedComments = prevState.comments.slice(0);
      const replyToIndex = updatedComments.findIndex(c => c.id === comment.reply_to);
      if (replyToIndex !== -1) {
        updatedComments[replyToIndex].no_replies += 1;
      }
      updatedComments.push(comment);
      return {
        expanded: true,
        comments: updatedComments,
        commentCount: this.getCommentCountIncrementedBy(1, prevState),
      };
    });
  }

  render() {
    const dateCreated = new Date(this.props.post.date_created);

    return (
      <Card
        className="Post__card"
        expanded={this.state.expanded}
        containerStyle={{ paddingBottom: 0 }}
      >
        <CardTitle
          className="Post__card-title"
          title={this.props.post.title}
          style={{ backgroundColor: this.randomPostColour }}
          titleStyle={{
            fontSize: '32px',
            fontFamily: '"Lobster Two", sans-serif',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        />

        {this.props.post &&
          <CardText
            className={`Post__content ${this.state.contentWrappedForLength ? 'Post__content--wrapped' : ''}`}
            style={{
              backgroundColor: 'white',
              fontSize: '16px',
            }}
          >
            <pre
              ref={this.contentRef}
              style={{
                margin: 0,
                fontFamily: '"Roboto", sans-serif',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >{this.props.post.content}
            </pre>
            {this.state.contentWrappedForLength &&
              <div className="Post__content-show-all">
                <FlatButton
                  primary
                  label="Alles lesen"
                  labelPosition="before"
                  icon={<KeyboardArrowDown />}
                  onClick={this.showAllContent}
                  labelStyle={{ fontSize: '12px' }}
                />
              </div>}
          </CardText>}

        <CardActions
          className="Post__card-actions"
          style={{ padding: '16px' }}
        >
          <UserDetailsPopover
            anchorEl={this.state.userDetailsPopoverAnchorEl}
            avatar={this.props.post.author_details.avatar}
            userId={this.props.post.author_details.pk}
            username={this.props.post.author_details.username}
            open={this.state.userDetailsPopoverOpen}
            onClose={this.hideUserDetailsPopover}
          />

          <ListItem
            disabled
            primaryText={
              <div
                role="button"
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  padding: '2px 0',
                }}
                title={this.props.post.author_details.username}
              >
                {this.props.post.author_details.username}
              </div>
            }
            secondaryText={`${getFormattedPostDate(dateCreated)}`}
            leftAvatar={
              <UserAvatar
                className="Post__author-avatar"
                size={40}
                img={this.props.post.author_details.avatar}
                username={this.props.post.author_details.username}
                onClick={this.showUserDetailsPopover}
                style={{ left: 0, top: 0 }}
              />}
            rightIcon={<FlatButton
              disabled={this.state.commentCount === 0}
              label={Post.getCommentsLabel(this.state.commentCount)}
              labelPosition="before"
              icon={<EditorModeComment color={lightGrey} style={{ width: '20px', marginRight: 0 }} />}
              onClick={this.toggleExpanded}
              style={{
                color: grey,
                fontSize: '12px',
                lineHeight: 'inherit',
                margin: 0,
                right: 0,
                top: '10px',
                minWidth: '10px',
                width: 'auto',
              }}
            />}
            style={{ padding: '0 0 0 50px' }}
          />
          <AddComment
            focusOnMount={false}
            postId={this.props.post.id}
            onAdded={this.handleCommentAdded}
          />
        </CardActions>

        <CardText className="Post__comments" expandable>
          <CommentsList
            hierarchyLevel={0}
            postId={this.props.post.id}
            comments={this.state.comments}
            commentCount={this.state.commentCount}
            onReplyAdded={this.handleCommentAdded}
            onCommentsLoaded={comments => this.setState({ comments })}
          />
          <div style={{ textAlign: 'center' }}>
            <FlatButton
              label="Zuklappen"
              labelStyle={{ color: grey, fontSize: '12px', fontWeight: 400 }}
              onClick={this.toggleExpanded}
            />
          </div>
        </CardText>
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
};

export default Post;
