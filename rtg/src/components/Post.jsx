import React from 'react';
import PropTypes from 'prop-types';

const Post = props => (
  <article className="Post">
    <p>From: {props.post.author_name}</p>
    <p>Title: {props.post.title}</p>
    <p>Content: {props.post.content}</p>
  </article>
);

Post.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default Post;
