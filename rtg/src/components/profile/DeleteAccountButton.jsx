import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import Notification, { NotificationType } from '../Notification';

const DeleteConfirmationModal = (props) => {
  const actions = [
    <FlatButton label="Abbrechen" onClick={props.onCancel} />,
    <FlatButton label="Account löschen" primary onClick={props.onConfirm} />,
  ];

  return (
    <Dialog
      actions={actions}
      modal
      open={props.open}
      title="Löschen bestätigen"
    >
      Alle deine Daten werden unwiderruflich gelöscht.<br /><br />
      Dies kann nicht rückgängig gemacht werden!
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

class DeleteAccountButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      savingIssues: false,
      deleteConfirmationModalOpen: false,
    };

    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleDeleteRequestCancelled = this.handleDeleteRequestCancelled.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDeleteRequest() {
    this.setState({ deleteConfirmationModalOpen: true });
  }

  handleDeleteRequestCancelled() {
    this.setState({ deleteConfirmationModalOpen: false });
  }

  handleDelete() {
    this.setState({
      saving: true,
      savingIssues: false,
      deleteConfirmationModalOpen: false,
    }, () => {
      fetch(`${API_BASE_URL}/rtg/users/${this.props.userId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${AuthService.getToken()}` },
      }).then((response) => {
        if (response.ok) {
          this.setState({ saving: false });
          this.props.onDelete(this.props.userId);
        } else {
          this.setState({ saving: false, savingIssues: true });
        }
      }).catch(() => this.setState({ saving: false, savingIssues: true }));
    });
  }

  render() {
    return (
      <div className="DeleteAccountButton" style={{ margin: '20px 0' }}>
        <DeleteConfirmationModal
          open={this.state.deleteConfirmationModalOpen}
          onCancel={this.handleDeleteRequestCancelled}
          onConfirm={this.handleDelete}
        />

        <h3 className="DeleteAccountButton__title">Account löschen</h3>
        <p style={{ margin: '20px auto', maxWidth: 500 }}>
          Du willst die RTG wirklich verlassen? Das ist äußerst bedauerlich! Klicke hier,
          um aus der Royalen Tippgemeinschaft auszutreten:
        </p>

        <RaisedButton
          label="Löschen"
          primary
          disabled={this.state.saving}
          style={{ width: 250 }}
          onClick={this.handleDeleteRequest}
        />

        {this.state.savingIssues &&
          <Notification
            type={NotificationType.ERROR}
            title="Problem beim Löschen"
            subtitle="Account wurde nicht gelöscht! Bitte versuche es erneut."
            style={{ margin: '20px auto', maxWidth: 500 }}
          />}
      </div>
    );
  }
}

DeleteAccountButton.propTypes = {
  userId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteAccountButton;
