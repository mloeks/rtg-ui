import React, { Component } from 'react';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import Post from '../components/Post';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';

import headingImg from '../theme/img/img7.jpg';
import './Foyer.css';

class Foyer extends Component {
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
    Foyer.loadPosts()
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
      <Page className="FoyerPage">
        <BigPicture className="Foyer__welcome" img={headingImg}>
          <h1 className="BigPicture__heading">Willkommen! ...</h1>
        </BigPicture>
        <section className="Foyer__news">
          <h2>Neuigkeiten</h2>
          {this.state.loadingError && <p>{this.state.loadingError}</p>}
          {this.state.posts.map(post => <Post key={post.id} post={post} />)}
        </section>
      </Page>
    );
  }
}

export default Foyer;
