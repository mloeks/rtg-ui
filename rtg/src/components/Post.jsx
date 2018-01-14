import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Avatar from 'material-ui/Avatar';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import './Post.css';

const Post = props => (
  <Card className="Post__card">
    <CardHeader
      title={props.post.title}
      subtitle={props.post.author_name}
      avatar={
        <Avatar
          color={props.muiTheme.palette.canvasColor}
          backgroundColor={props.muiTheme.palette.primary1Color}
          size={40}
        >{props.post.author_name[0].toUpperCase()}
        </Avatar>}
    />
    <CardText>{props.post.content}</CardText>
  </Card>
);

Post.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
  post: PropTypes.shape().isRequired,
};

export default muiThemeable()(Post);
