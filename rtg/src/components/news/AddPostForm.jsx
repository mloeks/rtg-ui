import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddPostFormDisplay from './AddPostFormDisplay';

class AddPostForm extends Component {
  static resetFieldErrors() {
    return {
      title: '',
      content: '',
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

      fieldErrors: AddPostForm.resetFieldErrors(),
    };

    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleFieldUpdate(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  handleSave(e) {
    e.preventDefault();
    // TODO P1 make request, handle response and return new post to callback
    this.props.onSaved();
  }

  render() {
    return (<AddPostFormDisplay
      title={this.state.title}
      content={this.state.content}
      appearInNews={this.state.appearInNews}
      sendMailToSubscribers={this.state.sendMailToSubscribers}
      sendMailToAll={this.state.sendMailToAll}

      titleError={this.state.fieldErrors.title}
      contentError={this.state.fieldErrors.content}

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
