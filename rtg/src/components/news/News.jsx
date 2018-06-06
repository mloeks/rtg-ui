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

// TODO P2 Lazy load news
// TODO P3 Allow deletion of news if admin
class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingError: null,

      posts: [],
      draft: null,

      offset: 0,

      addingPost: false,
      addPostSuccess: false,
    };

    this.pageSize = 5;
    this.newsSectionRef = React.createRef();

    this.handleAddNews = this.handleAddNews.bind(this);
    this.handlePostSaved = this.handlePostSaved.bind(this);
    this.handleAddPostCancelled = this.handleAddPostCancelled.bind(this);
  }

  componentDidMount() {
    this.loadPosts();
  }

  loadPosts() {
    fetch(`${API_BASE_URL}/rtg/posts/?news_appear=true&offset=${this.state.offset}&limit=${this.pageSize}`, {
      method: 'GET',
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson).then((response) => {
      this.setState((prevState) => {
        if (response.ok) {
          const newPosts = response.json.results;
          const draft = prevState.offset === 0 ? newPosts
            .find(post => !post.finished && post.author_details.pk === AuthService.getUserId())
            : null;

          return {
            addingPost: draft !== null && draft !== undefined,
            loading: false,
            loadingError: false,
            posts: prevState.posts.concat(newPosts.filter(post => post.finished)),
            draft,
            offset: prevState.offset + this.pageSize,
          };
        }

        return {
          loading: false,
          loadingError: 'Ein Fehler ist aufgetreten.',
          posts: [],
          draft: null,
        };
      });
    }).catch(() => {
      this.setState({
        loading: false,
        loadingError: 'Ein Fehler ist aufgetreten.',
        posts: [],
        draft: null,
      });
    });
  }

  handleAddNews() {
    // TODO P3 animated scroll (lib?)
    this.setState({ addingPost: true, addPostSuccess: false }, () => {
      const addNewsTopYPos = (window.pageYOffset +
        this.newsSectionRef.current.getBoundingClientRect().top) - 150;
      window.scrollTo(0, addNewsTopYPos);
    });
  }

  handlePostSaved(newPost) {
    this.setState((prevState) => {
      const newPosts = prevState.posts.slice(0);
      newPosts.unshift(newPost);

      return {
        posts: newPosts,
        addingPost: false,
        addPostSuccess: true,
        offset: prevState.offset + 1,
      };
    });
  }

  handleAddPostCancelled() {
    this.setState({ addingPost: false, addPostSuccess: false });
  }

  render() {
    return (
      <section className="News" ref={this.newsSectionRef}>
        {this.state.loading && <CircularProgress />}
        {(!this.state.loading && this.state.loadingError) &&
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden der Neuigkeiten"
            subtitle={this.state.loadingError}
            containerStyle={{ margin: 'auto', maxWidth: '480px' }}
          />}

        {(AuthService.isAdmin() && this.state.addingPost) &&
          <AddPostForm
            draft={this.state.draft}
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

        {(AuthService.isAdmin() && !this.state.addingPost) &&
          <div className="News__add-button">
            <FloatingActionButton onClick={this.handleAddNews}>
              <ContentAdd />
            </FloatingActionButton>
          </div>}
      </section>
    );
  }
}

export default News;
