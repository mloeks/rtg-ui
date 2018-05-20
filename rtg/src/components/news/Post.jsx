import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardActions, CardText, CardTitle, FlatButton, ListItem } from 'material-ui';
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
    if (noComments === 0) {
      desktopLabel = 'Kommentieren';
    } else if (noComments === 1) {
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
      commentCount: props.post.no_comments || 0,
      userDetailsPopoverAnchorEl: null,
      userDetailsPopoverOpen: false,
    };

    this.randomPostColour = randomHueHexColor(40, 90);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.showUserDetailsPopover = this.showUserDetailsPopover.bind(this);
    this.hideUserDetailsPopover = this.hideUserDetailsPopover.bind(this);
    this.handleCommentAdded = this.handleCommentAdded.bind(this);
    this.getCommentCountIncrementedBy = this.getCommentCountIncrementedBy.bind(this);
  }

  getCommentCountIncrementedBy(inc, state = this.state) {
    return state.commentCount + 1;
  }

  toggleExpanded() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  showUserDetailsPopover(e) {
    e.preventDefault();
    this.setState({ userDetailsPopoverOpen: true, userDetailsPopoverAnchorEl: e.currentTarget });
  }

  hideUserDetailsPopover() {
    this.setState({ userDetailsPopoverOpen: false });
  }

  handleCommentAdded() {
    this.setState(prevState => (
      { expanded: true, commentCount: this.getCommentCountIncrementedBy(1, prevState) }
    ));
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
          }}
        />

        <CardText
          style={{
            backgroundColor: 'white',
            fontSize: '16px',
            wordBreak: 'break-word',
          }}
        >{this.props.post.content}
        </CardText>

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
            commentCount={this.state.commentCount}
            onReplyAdded={() =>
              this.setState({ commentCount: this.getCommentCountIncrementedBy(1) })}
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

Post.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  post: PropTypes.shape().isRequired,
};

export default muiThemeable()(Post);
