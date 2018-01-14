import React, { Component } from 'react';
import BigPicture from '../components/BigPicture';
import Post from '../components/Post';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';

import headingImg from '../theme/img/img7.jpg';
import './Reception.css';

class Reception extends Component {
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
      loadingError: null,
      posts: [],
    };
  }

  componentDidMount() {
    Reception.loadPosts()
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

  render() {
    return (
      <div>
        <BigPicture className="Reception__welcome" img={headingImg}>
          <h1 className="BigPicture__heading">Willkommen! ...</h1>
        </BigPicture>
        <section className="Reception__news">
          <h2>Neuigkeiten</h2>
          {this.state.loadingError && <p>{this.state.loadingError}</p>}
          {this.state.posts.map(post => <Post key={post.id} post={post} />)}
        </section>
      </div>
    );
  }
}

export default Reception;
