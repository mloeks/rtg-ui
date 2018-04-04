import React, { Component } from 'react';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import Post from '../Post';

// TODO P1 make them look nice
// TODO P1 Add possibility to create news, at least for Admins
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

  componentDidMount() {
    News.loadPosts()
      .then((response) => {
        this.setState({
          loadingError: false,
          posts: response.results,
        });
      })
      .catch((error) => {
        this.setState({
          loadingError: error.message,
          posts: [],
        });
      });
  }

  constructor(props) {
    super(props);

    this.state = {
      loadingError: null,
      posts: [],
    };
  }

  render() {
    return (
      <section className="Foyer__news">
        {this.state.loadingError && <p>{this.state.loadingError}</p>}
        {this.state.posts.map(post => <Post key={post.id} post={post}/>)}
      </section>
    );
  }
}

export default News;
