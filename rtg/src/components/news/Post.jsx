import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardHeader, CardText, CardTitle, Divider } from 'material-ui';
import { format, isToday, isYesterday } from 'date-fns';
import de from 'date-fns/locale/de';
import UserAvatar from '../UserAvatar';
import { API_BASE_URL } from '../../service/AuthService';
import { randomHueHexColor } from '../../service/ColorHelper';
import { lightGrey } from '../../theme/RtgTheme';

import './Post.css';

const Post = (props) => {
  const userAvatarUrl = props.post.author_details.avatar ?
    `${API_BASE_URL}/media/${props.post.author_details.avatar}` : null;

  const getFormattedPostDate = (date) => {
    if (isToday(date)) {
      return 'Heute';
    } else if (isYesterday(date)) {
      return 'Gestern';
    }
    return format(date, 'dd. D. MMMM', { locale: de });
  };

  const dateCreated = new Date(props.post.date_created);
  const formattedPostTime = format(dateCreated, 'HH:mm [Uhr]');

  const randomPostColour = randomHueHexColor(45, 97);

  return (
    <Card className="Post__card">
      <CardTitle
        title={props.post.title}
        style={{ backgroundColor: randomPostColour, paddingBottom: '5px' }}
        titleStyle={{
          fontSize: '32px',
          fontFamily: '"Lobster Two", sans-serif',
          wordBreak: 'break-word',
        }}
      />
      <CardHeader
        title={props.post.author_details.username}
        subtitle={`${getFormattedPostDate(dateCreated)}, ${formattedPostTime}`}
        avatar={
          <UserAvatar
            size={40}
            img={userAvatarUrl}
            username={props.post.author_details.username}
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
      >{props.post.content}
      </CardText>
    </Card>
  );
};

Post.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  post: PropTypes.shape().isRequired,
};

export default muiThemeable()(Post);
