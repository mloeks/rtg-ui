import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Post from './Post';
import Notification, { NotificationType } from '../Notification';
import AddPostForm from './AddPostForm';

import './News.scss';

// TODO P3 Allow deletion of news if admin
// TODO P3 load potential draft in a separate request and filter
// drafts out of the main posts request. Then persist news_appear correctly
// in the draft.
class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingError: null,

      posts: [],
      draft: null,

      count: 0,
      offset: 0,

      addingPost: false,
      addPostSuccess: false,
    };

    this.pageSize = 5;
    this.newsSectionRef = React.createRef();

    this.loadPosts = this.loadPosts.bind(this);
    this.handleAddNews = this.handleAddNews.bind(this);
    this.handlePostSaved = this.handlePostSaved.bind(this);
    this.handleAddPostCancelled = this.handleAddPostCancelled.bind(this);
  }

  componentDidMount() {
    this.loadPosts();
  }

  loadPosts() {
    const { offset } = this.state;
    this.setState({ loading: true });
    fetch(`${API_BASE_URL}/rtg/posts/?news_appear=true&offset=${offset}&limit=${this.pageSize}`, {
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
            count: response.json.count,
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
      const addNewsTopYPos = (window.pageYOffset
        + this.newsSectionRef.current.getBoundingClientRect().top) - 150;
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
        count: newPost.news_appear ? prevState.count + 1 : prevState.count,
        offset: newPost.news_appear ? prevState.offset + 1 : prevState.offset,
      };
    });
  }

  handleAddPostCancelled() {
    this.setState({ addingPost: false, addPostSuccess: false });
  }

  render() {
    const {
      addingPost,
      addPostSuccess,
      count,
      draft,
      loading,
      loadingError,
      offset,
      posts,
    } = this.state;
    const { theme } = this.props;

    const numberOfFurtherPosts = Math.min(this.pageSize, count - offset);
    return (
      <section className="News" ref={this.newsSectionRef}>
        {(AuthService.isAdmin() && addingPost) && (
          <AddPostForm
            draft={draft}
            onSaved={this.handlePostSaved}
            onCancelled={this.handleAddPostCancelled}
          />
        )}
        {(AuthService.isAdmin() && addPostSuccess) && (
          <Notification
            type={NotificationType.SUCCESS}
            title="Neuigkeit erfolgreich hinzugefügt/verschickt."
            disappearAfterMs={3000}
          />
        )}

        {!loadingError && posts
          .filter(post => post.news_appear === true)
          .map(post => <Post key={post.id} post={post} />)}

        {(!loading && !loadingError) && posts.length === 0 && (
          <div className="News__empty-state" style={{ color: theme.palette.grey['500'] }}>
            <ChatBubbleOutlineIcon style={{ height: 80, width: 80 }} />
            <br />
            Keine Neuigkeiten.
          </div>
        )}

        {(offset < count) && (
          <Button disabled={loading} color="primary" onClick={this.loadPosts}>
            {`${numberOfFurtherPosts} weitere Neuigkeit${numberOfFurtherPosts > 1 ? 'en' : ''} laden`}
            <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />
          </Button>
        )}
        <br />

        {loading && <CircularProgress style={{ margin: '20px auto' }} />}
        {(!loading && loadingError) && (
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden der Neuigkeiten."
            subtitle={loadingError}
            containerStyle={{ margin: 'auto', maxWidth: '480px' }}
          />
        )}

        {(AuthService.isAdmin() && !addingPost) && (
          <div className="News__add-button">
            <Fab color="primary" onClick={this.handleAddNews}><AddIcon /></Fab>
          </div>
        )}
      </section>
    );
  }
}

News.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(News);
