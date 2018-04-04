import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddPostFormDisplay from './AddPostFormDisplay';

class AddPostForm extends Component {
  static resetFieldErrors() {
    return { title: '' };
  }

  constructor(props) {
    super(props);

    this.state = {
      title: 'Neuer Post!',
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
    return <AddPostFormDisplay
      title={this.state.title}
      titleError={this.state.fieldErrors.title}

      onFieldChange={this.handleFieldUpdate}
      onSubmit={this.handleSave}
    />;
  }
}

AddPostForm.propTypes = {
  onSaved: PropTypes.func.isRequired,
};

export default AddPostForm;
