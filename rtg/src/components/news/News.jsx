import React, { Component } from 'react';
import { CircularProgress, FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons/index';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Post from './Post';
import Notification, { NotificationType } from '../Notification';

import './News.css';
import AddPostForm from "./AddPostForm";

// TODO P1 make them look nice
// TODO P2 Lazy load news
// TODO P2 Allow normal users to post and comment on news
class News extends Component {
  static async loadPosts() {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/rtg/posts/`, {
        method: 'GET',
        headers: { Authorization: `Token ${AuthService.getToken()}` },
      })
        .then(FetchHelper.parseJson)
        .then(response => (
          response.ok ? resolve(response.json) : reject(new Error('Ein Fehler ist aufgetreten.'))
        ))
        .catch(() => {
          reject(new Error('Ein Fehler ist aufgetreten.'));
        });
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingError: null,

      posts: [],

      addingPost: false,
    };

    this.handleAddNews = this.handleAddNews.bind(this);
    this.handlePostSaved = this.handlePostSaved.bind(this);
    this.handleAddPostCancelled = this.handleAddPostCancelled.bind(this);
  }

  componentDidMount() {
    News.loadPosts()
      .then((response) => {
        this.setState({
          loading: false,
          loadingError: false,
          posts: response.results,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          loadingError: error.message,
          posts: [],
        });
      });
  }

  handleAddNews() {
    // TODO P1 scroll to top...
    this.setState({ addingPost: true });
  }

  handlePostSaved(newPost) {
    // TODO P1 prepend new post to posts list - or reload entirely?
    this.setState(prevState => {
      const newPosts = prevState.posts.slice(0);
      newPosts.unshift(newPost);

      return {
        posts: newPosts,
        addingPost: false,
      };
    });
  }

  handleAddPostCancelled() {
    this.setState({ addingPost: false });
  }

  render() {
    return (
      <section className="News">
        {this.state.loading && <CircularProgress />}
        {(!this.state.loading && this.state.loadingError) &&
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden"
            subtitle={this.state.loadingError}
            style={{ margin: 'auto', maxWidth: '480px' }}
          />}

        {(AuthService.isAdmin() && this.state.addingPost) &&
          <AddPostForm
            onSaved={this.handlePostSaved}
            onCancelled={this.handleAddPostCancelled}
          />
        }

        {(!this.state.loading && !this.state.loadingError) &&
          this.state.posts
            .filter(post => post.news_appear === true)
            .map(post => <Post key={post.id} post={post} />)}

        {(AuthService.isAdmin() && !this.state.addingPost) &&
          <FloatingActionButton className="News__add-button">
            <ContentAdd onClick={this.handleAddNews} />
          </FloatingActionButton>}
      </section>
    );
  }
}

export default News;
