import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { FlatButton } from 'material-ui';

class RegisterDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      passwordRepeat: null,
      firstName: null,
      lastName: null,
      email: null,

      hasChanges: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.onSubmit(this.state.username, this.state.password);
  }

  render() {
    const actions = [
      <FlatButton label="Abbrechen" secondary onClick={this.props.onCancel} />,
      <FlatButton
        label="Submit"
        primary
        disabled={!this.state.hasChanges}
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Werde Teil der Royalen Tippgemeinschaft"
        actions={actions}
        modal
        open={this.props.open}
      >
        Only actions can close this dialog.
      </Dialog>
    );
  }
}

RegisterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterDialog;
