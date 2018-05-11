import React, { Component } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardActions, CardHeader, CardText, CardTitle, Divider, FlatButton } from 'material-ui';
import EditorModeComment from 'material-ui/svg-icons/editor/mode-comment';
import { format, isToday, isYesterday } from 'date-fns';
import de from 'date-fns/locale/de';
import UserAvatar from '../UserAvatar';
import { randomHueHexColor } from '../../service/ColorHelper';
import { lightGrey } from '../../theme/RtgTheme';

import './Post.css';

class Post extends Component {
  static getCommentsLabel(noComments) {
    if (noComments === 0) {
      return 'Kommentieren';
    }
    if (noComments === 1) {
      return '1 Kommentar';
    }
    return `${noComments} Kommentare`;
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
          title={this.props.post.title}
          style={{ backgroundColor: randomPostColour, paddingBottom: '5px' }}
          titleStyle={{
            fontSize: '32px',
            fontFamily: '"Lobster Two", sans-serif',
            wordBreak: 'break-word',
          }}
        />
        <CardHeader
          title={this.props.post.author_details.username}
          subtitle={`${Post.getFormattedPostDate(dateCreated)}, ${formattedPostTime}`}
          avatar={
            <UserAvatar
              size={40}
              img={this.props.post.author_details.avatar}
              username={this.props.post.author_details.username}
            />}
          style={{ backgroundColor: randomPostColour }}
          subtitleStyle={{ fontWeight: 400 }}
        />
        <Divider style={{ height: '2px', backgroundColor: lightGrey }} />
        <CardText
          style={{
            backgroundColor: 'white',
            wordBreak: 'break-word',
          }}
        >{this.props.post.content}
        </CardText>
        <Divider style={{ height: '1px', backgroundColor: lightGrey }} />
        <CardActions>
          <FlatButton
            label={Post.getCommentsLabel(this.props.post.no_comments)}
            icon={<EditorModeComment />}
            onClick={this.toggleExpanded}
          />
        </CardActions>
        <CardText expandable>
          Bla bla bla
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
