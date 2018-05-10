import React, { Component } from 'react';
import { CircularProgress, FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons/index';
import ChatBubbleOutline from 'material-ui/svg-icons/communication/chat-bubble-outline';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Post from './Post';
import Notification, { NotificationType } from '../Notification';
import AddPostForm from './AddPostForm';
import { lightGrey } from '../../theme/RtgTheme';

import './News.css';

// TODO P1 Allow normal users to comment on news
// TODO P2 FEATURE Prio 1 - add section "recent games" to the top
// TODO P2 Lazy load news
// TODO P2 Save drafts while adding a post
// TODO P2 Allow deletion of news if admin
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
      addPostSuccess: false,
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
    // TODO P3 animated scroll (lib?)
    window.scrollTo(0, 0);
    this.setState({ addingPost: true, addPostSuccess: false });
  }

  handlePostSaved(newPost) {
    this.setState((prevState) => {
      const newPosts = prevState.posts.slice(0);
      newPosts.unshift(newPost);

      return {
        posts: newPosts,
        addingPost: false,
        addPostSuccess: true,
      };
    });
  }

  handleAddPostCancelled() {
    this.setState({ addingPost: false, addPostSuccess: false, });
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
        {(AuthService.isAdmin() && this.state.addPostSuccess) &&
          <Notification
            type={NotificationType.SUCCESS}
            title="Neuigkeit erfolgreich hinzugefügt/verschickt."
            disappearAfterMs={3000}
          />}

        {(!this.state.loading && !this.state.loadingError) &&
          this.state.posts
            .filter(post => post.news_appear === true)
            .map(post => <Post key={post.id} post={post} />)}

        {(!this.state.loading && !this.state.loadingError) && this.state.posts.length === 0 &&
          <div className="News__empty-state" style={{ color: lightGrey }}>
            <ChatBubbleOutline color={lightGrey} style={{ height: 80, width: 80 }} /><br />
            Keine Neuigkeiten.
          </div>}

        {/* TODO P1 Stop fixing button to bottom left corner if user scrolls further down */}
        {(AuthService.isAdmin() && !this.state.addingPost) &&
          <FloatingActionButton className="News__add-button" onClick={this.handleAddNews}>
            <ContentAdd />
          </FloatingActionButton>}
      </section>
    );
  }
}

export default News;
