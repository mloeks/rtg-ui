import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardActions, CardText, CardTitle, FlatButton, ListItem } from 'material-ui';
import EditorModeComment from 'material-ui/svg-icons/editor/mode-comment';
import { format, isToday, isYesterday } from 'date-fns';
import de from 'date-fns/locale/de';
import UserAvatar from '../UserAvatar';
import CommentsList from './CommentsList';
import { randomHueHexColor } from '../../service/ColorHelper';
import { grey, lightGrey } from '../../theme/RtgTheme';

import './Post.css';

class Post extends Component {
  static getCommentsLabel(noComments) {
    let desktopLabel;
    let mobileLabel = noComments;

    if (noComments === 0) {
      desktopLabel = 'Kommentieren';
    } else if (noComments === 1) {
      desktopLabel = '1 Kommentar';
    } else {
      desktopLabel = `${noComments} Kommentare`;
    }
    return (
      <Fragment>
        <span className="Post__comments-label-mobile">{mobileLabel}</span>
        <span className="Post__comments-label-desktop">{desktopLabel}</span>
      </Fragment>
    );
  }

  static getFormattedPostDate(date) {
    if (isToday(date)) {
      return 'Heute';
    } else if (isYesterday(date)) {
      return 'Gestern';
    }
    return format(date, 'dd. D. MMMM', { locale: de });
  }

  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  render() {
    const dateCreated = new Date(this.props.post.date_created);
    const formattedPostTime = format(dateCreated, 'HH:mm [Uhr]');

    const randomPostColour = randomHueHexColor(45, 97);

    return (
      <Card className="Post__card" expanded={this.state.expanded}>
        <CardTitle
          className="Post__card-title"
          title={this.props.post.title}
          style={{ backgroundColor: randomPostColour }}
          titleStyle={{
            fontSize: '32px',
            fontFamily: '"Lobster Two", sans-serif',
            wordBreak: 'break-word',
          }}
        />

        <CardText
          style={{
            backgroundColor: 'white',
            wordBreak: 'break-word',
          }}
        >{this.props.post.content}
        </CardText>

        <CardActions
          className="Post__card-actions"
          style={{ backgroundColor: randomPostColour, padding: 0 }}
        >
          <ListItem
            disabled
            primaryText={
              <div
                style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                title={this.props.post.author_details.username}
              >
                {this.props.post.author_details.username}
              </div>
            }
            secondaryText={`${Post.getFormattedPostDate(dateCreated)}, ${formattedPostTime}`}
            leftAvatar={
              <UserAvatar
                size={40}
                img={this.props.post.author_details.avatar}
                username={this.props.post.author_details.username}
              />}
            rightIcon={<FlatButton
              label={Post.getCommentsLabel(this.props.post.no_comments)}
              labelPosition="before"
              icon={<EditorModeComment color={lightGrey} style={{ width: '20px', marginRight: 0 }} />}
              style={{
                color: grey,
                fontSize: '12px',
                lineHeight: 'inherit',
                marginRight: 0,
                minWidth: '10px',
                width: 'auto',
              }}
              onClick={this.toggleExpanded}
            />}
          />
        </CardActions>

        <CardText expandable>
          <CommentsList postId={this.props.post.id} showAddComment />
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
