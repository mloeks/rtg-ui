import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import AddPostFormDisplay from './AddPostFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import { debounce } from '../../service/EventsHelper';

class AddPostForm extends Component {
  static resetFieldErrors() {
    return {
      title: '',
      content: '',
    };
  }

  static errorResponseToStateMapper(responseJson) {
    if (!responseJson) {
      return { savingError: true };
    }

    return {
      savingError: true,
      nonFieldError: responseJson.detail || '',
      fieldErrors: {
        title: responseJson.title ? responseJson.title[0] : '',
        content: responseJson.content ? responseJson.content[0] : '',
      },
    };
  }
  static draftSavedResponseToState(responseJson) {
    return { id: responseJson.id };
  }

  constructor(props) {
    super(props);

    this.state = {
      id: props.draft ? props.draft.id : null,
      title: props.draft ? props.draft.title : '',
      content: props.draft ? props.draft.content : '',
      appearInNews: props.draft ? props.draft.news_appear : true,
      sendMail: true,
      sendMailToSubscribers: true,
      sendMailToActive: false,
      sendMailToInactive: false,
      sendMailToAll: false,

      savingInProgress: false,
      savingError: false,

      draftSaving: false,
      draftSaved: false,
      draftSavingError: false,

      nonFieldError: '',
      fieldErrors: AddPostForm.resetFieldErrors(),
    };

    this.savePost = this.savePost.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleFieldsUpdate = this.handleFieldsUpdate.bind(this);
    this.handleSaveDraft = debounce(this.handleSaveDraft.bind(this), 1500);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancelled = this.handleCancelled.bind(this);
  }

  getPostBodyFromState() {
    return {
      id: this.state.id,
      author: AuthService.getUserId(),
      title: this.state.title,
      content: this.state.content,
      news_appear: this.state.appearInNews,
      as_mail: this.state.sendMail,
      force_active_users: this.state.sendMailToActive,
      force_inactive_users: this.state.sendMailToInactive,
      force_all_users: this.state.sendMailToAll,
    };
  }

  savePost(post, successCallback, errorCallback) {
    fetch(`${API_BASE_URL}/rtg/posts/${post.id ? `${post.id}/` : ''}`, {
      method: post.id ? 'PATCH' : 'POST',
      body: JSON.stringify(post),
      headers: {
        Authorization: `Token ${AuthService.getToken()}`,
        'content-type': 'application/json',
      },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          successCallback(response.json);
        } else {
          errorCallback(response.json);
        }
      }).catch(() => errorCallback());
  }

  handleFieldUpdate(fieldName, value) {
    this.setState(
      { [fieldName]: value, draftSaving: true, draftSaved: false },
      this.handleSaveDraft,
    );
  }

  handleFieldsUpdate(updatedFieldsObject) {
    this.setState(
      { ...updatedFieldsObject, draftSaving: true, draftSaved: false },
      this.handleSaveDraft,
    );
  }

  handleSaveDraft() {
    this.setState({ draftSaving: true });
    // always save drafts with news_appear = true (regardless of the actual checkbox value)
    // otherwise drafts currently won't be loaded after page reload
    const postToSave = { ...this.getPostBodyFromState(), finished: false, news_appear: true };
    this.savePost(postToSave, (responseJson) => {
      this.setState({
        draftSaving: false,
        draftSaved: true,
        draftSavingError: false,
        ...AddPostForm.draftSavedResponseToState(responseJson),
      });
    }, () => {
      this.setState({ draftSaving: false, draftSaved: false, draftSavingError: true });
    });
  }

  handleSave(e) {
    e.preventDefault();
    this.setState({ savingInProgress: true });
    const postToSave = { ...this.getPostBodyFromState(), finished: true };

    this.savePost(postToSave, (responseJson) => {
      this.setState({ savingInProgress: false });
      this.props.onSaved(responseJson);
    }, (responseJson) => {
      this.setState({
        savingInProgress: false,
        ...AddPostForm.errorResponseToStateMapper(responseJson),
      });
    });
  }

  handleCancelled() {
    // fire & forget DELETE post
    if (this.state.id) {
      fetch(`${API_BASE_URL}/rtg/posts/${this.state.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${AuthService.getToken()}` },
      });
    }
    this.props.onCancelled();
  }

  render() {
    return (<AddPostFormDisplay
      title={this.state.title}
      content={this.state.content}
      appearInNews={this.state.appearInNews}

      sendMail={this.state.sendMail}
      sendMailToSubscribers={this.state.sendMailToSubscribers}
      sendMailToActive={this.state.sendMailToActive}
      sendMailToInactive={this.state.sendMailToInactive}
      sendMailToAll={this.state.sendMailToAll}

      nonFieldError={this.state.nonFieldError}
      titleError={this.state.fieldErrors.title}
      contentError={this.state.fieldErrors.content}

      savingInProgress={this.state.savingInProgress}
      savingError={this.state.savingError}

      draftSaving={this.state.draftSaving}
      draftSaved={this.state.draftSaved}
      draftSavingError={this.state.draftSavingError}

      onFieldChange={this.handleFieldUpdate}
      onFieldsChange={this.handleFieldsUpdate}
      onSubmit={this.handleSave}
      onCancel={this.handleCancelled}
    />);
  }
}

AddPostForm.defaultProps = {
  draft: null,
};

AddPostForm.propTypes = {
  draft: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    news_appear: PropTypes.bool,
  }),
  onSaved: PropTypes.func.isRequired,
  onCancelled: PropTypes.func.isRequired,
};

export default AddPostForm;
