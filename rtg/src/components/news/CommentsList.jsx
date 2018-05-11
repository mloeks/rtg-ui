import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import { CircularProgress } from 'material-ui';
import Notification, { NotificationType } from '../Notification';
import Comment from './Comment';

class CommentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      loadingError: false,
    };
  }

  async componentDidMount() {
    const commentFilterParam = this.props.replyTo ? `reply_to=${this.props.replyTo}` : 'toplevel=true';
    await fetch(`${API_BASE_URL}/rtg/comments/?post=${this.props.postId}&${commentFilterParam}`, {
      method: 'GET',
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    })
      .then(FetchHelper.parseJson)
      .then(response => (
        this.setState({
          loading: false,
          ...response.ok ? { comments: response.json.results } : { loadingError: true },
        })
      ))
      .catch(() => this.setState({ loading: false, loadingError: true }));
  }

  render() {
    return (
      <div className="CommentsList">
        {this.state.loading &&
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={25} thickness={2} style={{ margin: '0 auto' }} />
          </div>}

        {!this.state.loading && this.state.comments.map(comment =>
          <Comment key={`comment-${comment.id}`} postId={this.props.postId} comment={comment} />)}

        {this.state.loadingError &&
          <Notification
            type={NotificationType.ERROR}
            title="Fehler beim Laden"
            subtitle="Bitte versuche es erneut."
          />}
      </div>
    );
  }
}

CommentsList.defaultProps = {
  replyTo: null,
};

CommentsList.propTypes = {
  postId: PropTypes.number.isRequired,
  replyTo: PropTypes.number,
};

export default CommentsList;
