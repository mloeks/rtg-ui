import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import AddPostFormDisplay from './AddPostFormDisplay';
import FetchHelper from '../../service/FetchHelper';
import { debounce } from '../../service/EventsHelper';

// TODO P3 since adding Quill editor, it is possible to add posts without content
class AddPostForm extends Component {
  static resetFieldErrors() {
    return {
      title: '',
      content: '',
    };
  }

  static savePost(post, successCallback, errorCallback) {
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
      sendMailOption: 'sendMailToSubscribers',

      savingInProgress: false,
      savingError: false,

      draftSaving: false,
      draftSaved: false,
      draftSavingError: false,

      nonFieldError: '',
      fieldErrors: AddPostForm.resetFieldErrors(),
    };

    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleSaveDraft = debounce(this.handleSaveDraft.bind(this), 1500);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancelled = this.handleCancelled.bind(this);
  }

  handleFieldUpdate(fieldName, value) {
    this.setState(
      { [fieldName]: value, draftSaving: true, draftSaved: false },
      this.handleSaveDraft,
    );
  }

  handleSaveDraft() {
    this.setState({ draftSaving: true });
    // always save drafts with news_appear = true (regardless of the actual checkbox value)
    // otherwise drafts currently won't be loaded after page reload
    const postToSave = { ...this.getPostBodyFromState(), finished: false, news_appear: true };
    AddPostForm.savePost(postToSave, (responseJson) => {
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

    AddPostForm.savePost(postToSave, (responseJson) => {
      const { onSaved } = this.props;
      this.setState({ savingInProgress: false });
      onSaved(responseJson);
    }, (responseJson) => {
      this.setState({
        savingInProgress: false,
        ...AddPostForm.errorResponseToStateMapper(responseJson),
      });
    });
  }

  handleCancelled() {
    const { id } = this.state;
    const { onCancelled } = this.props;

    // fire & forget DELETE post
    if (id) {
      fetch(`${API_BASE_URL}/rtg/posts/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${AuthService.getToken()}` },
      });
    }
    onCancelled();
  }

  getPostBodyFromState() {
    const {
      appearInNews,
      content,
      id,
      sendMail,
      sendMailOption,
      title,
    } = this.state;

    const postBody = {
      id,
      author: AuthService.getUserId(),
      title,
      content,
    };

    if (AuthService.isAdmin()) {
      postBody.news_appear = appearInNews;
      postBody.as_mail = sendMail;
      postBody.force_active_users = sendMailOption === 'sendMailToActive';
      postBody.force_inactive_users = sendMailOption === 'sendMailToInactive';
      postBody.force_all_users = sendMailOption === 'sendMailToAll';
    }

    return postBody;
  }

  render() {
    const {
      appearInNews,
      content,
      draftSaved,
      draftSaving,
      draftSavingError,
      fieldErrors,
      nonFieldError,
      savingError,
      savingInProgress,
      sendMail,
      sendMailOption,
      title,
    } = this.state;

    return (
      <AddPostFormDisplay
        showMailOptions={AuthService.isAdmin()}
        title={title}
        content={content}
        appearInNews={appearInNews}
        sendMail={sendMail}
        sendMailOption={sendMailOption}
        nonFieldError={nonFieldError}
        titleError={fieldErrors.title}
        contentError={fieldErrors.content}
        savingInProgress={savingInProgress}
        savingError={savingError}
        draftSaving={draftSaving}
        draftSaved={draftSaved}
        draftSavingError={draftSavingError}
        onFieldChange={this.handleFieldUpdate}
        onSubmit={this.handleSave}
        onCancel={this.handleCancelled}
      />
    );
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
