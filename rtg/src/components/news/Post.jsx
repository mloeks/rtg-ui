import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardHeader, CardText, CardTitle, Divider } from 'material-ui';
import { format, isToday, isYesterday } from 'date-fns';
import de from 'date-fns/locale/de';
import UserAvatar from '../UserAvatar';
import { API_BASE_URL } from '../../service/AuthService';

import './Post.css';

// TODO P2 give CardTitle a very pale random colour
const Post = (props) => {
  const userAvatarUrl = props.post.author_details.avatar ?
    `${API_BASE_URL}/media/${props.post.author_details.avatar}` : null;

  const dateCreatedAsDate = new Date(props.post.date_created);
  let formattedPostDate =
    format(dateCreatedAsDate, 'dd. D. MMMM', { locale: de });
  if (isToday(dateCreatedAsDate)) {
    formattedPostDate = 'Heute';
  } else if (isYesterday(dateCreatedAsDate)) {
    formattedPostDate = 'Gestern';
  }
  const formattedPostTime = format(dateCreatedAsDate, 'HH:mm [Uhr]');

  return (
    <Card className="Post__card">
      <CardTitle
        title={props.post.title}
        style={{ paddingBottom: '5px' }}
        titleStyle={{
          fontSize: '32px',
          fontFamily: '"Lobster Two", sans-serif',
          wordBreak: 'break-word',
        }}
      />
      <CardHeader
        title={props.post.author_details.username}
        subtitle={`${formattedPostDate}, ${formattedPostTime}`}
        avatar={
          <UserAvatar
            size={40}
            img={userAvatarUrl}
            username={props.post.author_details.username}
          />}
        subtitleStyle={{ fontWeight: 400 }}
      />
      <Divider />
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
