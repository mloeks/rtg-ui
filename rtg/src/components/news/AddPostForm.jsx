import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import AddPostFormDisplay from './AddPostFormDisplay';
import FetchHelper from "../../service/FetchHelper";

// TODO P1 why do I get a 403 response?
class AddPostForm extends Component {
  static resetFieldErrors() {
    return {
      title: '',
      content: '',
    };
  }

  // TODO P1 test different possible error responses
  static errorResponseToStateMapper(responseJson) {
    return {
      savingError: true,
      nonFieldError: responseJson.non_field_errors || responseJson.detail || '',
      fieldErrors: responseJson.field_errors ? {
        title: responseJson.field_errors.title || '',
        content: responseJson.field_errors.content || '',
      } : {},
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      appearInNews: true,
      sendMailToSubscribers: true,
      sendMailToAll: false,

      savingInProgress: false,
      savingError: false,
      nonFieldError: '',
      fieldErrors: AddPostForm.resetFieldErrors(),
    };

    this.postPost = this.postPost.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  postPost(post) {
    fetch(`${API_BASE_URL}/rtg/posts/`, {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        Authorization: `Token ${AuthService.getToken()}`,
        'content-type': 'application/json',
      },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          this.setState({ savingInProgress: false });
          this.props.onSaved(response.json);
        } else {
          this.setState(() => ({
            savingInProgress: false,
            savingError: true,
            ...AddPostForm.errorResponseToStateMapper(response.json),
          }));
        }
      }).catch(() => this.setState({ savingInProgress: false, savingError: true }));
  }

  handleFieldUpdate(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  handleSave(e) {
    e.preventDefault();
    const newPost = {
      author: AuthService.getUserId(),
      title: this.state.title,
      content: this.state.content,
      finished: true,
      news_appear: this.state.appearInNews,
      as_mail: this.state.sendMailToSubscribers,
      force_mail: this.state.sendMailToAll,
    };
    this.postPost(newPost);
  }

  render() {
    return (<AddPostFormDisplay
      title={this.state.title}
      content={this.state.content}
      appearInNews={this.state.appearInNews}
      sendMailToSubscribers={this.state.sendMailToSubscribers}
      sendMailToAll={this.state.sendMailToAll}

      nonFieldError={this.state.nonFieldError}
      titleError={this.state.fieldErrors.title}
      contentError={this.state.fieldErrors.content}

      savingInProgress={this.state.savingInProgress}
      savingError={this.state.savingError}

      onFieldChange={this.handleFieldUpdate}
      onSubmit={this.handleSave}
      onCancel={this.props.onCancelled}
    />);
  }
}

AddPostForm.propTypes = {
  onSaved: PropTypes.func.isRequired,
  onCancelled: PropTypes.func.isRequired,
};

export default AddPostForm;
