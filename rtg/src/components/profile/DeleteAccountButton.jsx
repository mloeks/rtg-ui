import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import AuthService, { API_BASE_URL } from '../../service/AuthService';
import Notification, { NotificationType } from '../Notification';

const DeleteConfirmationModal = ({
  fullScreen, onCancel, onConfirm, open,
}) => (
  <Dialog
    fullScreen={fullScreen}
    open={open}
    aria-labelledby="DeleteConfirmationModal__title"
    onClose={onCancel}
  >
    <DialogTitle id="DeleteConfirmationModal__title">Löschen bestätigen</DialogTitle>
    <DialogContent>
      Alle deine Daten werden unwiderruflich gelöscht.
      <br />
      <br />
      Dies kann nicht rückgängig gemacht werden!
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={onCancel}>Abbrechen</Button>
      <Button color="primary" onClick={onConfirm}>Account löschen</Button>
    </DialogActions>
  </Dialog>
);

DeleteConfirmationModal.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
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
      const { onDelete, userId } = this.props;
      fetch(`${API_BASE_URL}/rtg/users/${userId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${AuthService.getToken()}` },
      }).then((response) => {
        if (response.ok) {
          this.setState({ saving: false });
          onDelete(userId);
        } else {
          this.setState({ saving: false, savingIssues: true });
        }
      }).catch(() => this.setState({ saving: false, savingIssues: true }));
    });
  }

  render() {
    const { deleteConfirmationModalOpen, saving, savingIssues } = this.state;
    const { fullScreen } = this.props;

    return (
      <div className="DeleteAccountButton" style={{ margin: '20px 0' }}>
        <DeleteConfirmationModal
          open={deleteConfirmationModalOpen}
          fullScreen={fullScreen}
          onCancel={this.handleDeleteRequestCancelled}
          onConfirm={this.handleDelete}
        />

        <h3 className="DeleteAccountButton__title">Account löschen</h3>
        <p style={{ margin: '20px auto', maxWidth: 500 }}>
          Du willst die RTG wirklich verlassen? Das ist äußerst bedauerlich! Klicke hier,
          um aus der Royalen Tippgemeinschaft auszutreten:
        </p>

        <Button
          variant="contained"
          color="primary"
          disabled={saving}
          style={{ width: 250 }}
          onClick={this.handleDeleteRequest}
        >
          Löschen
        </Button>

        {savingIssues && (
          <Notification
            type={NotificationType.ERROR}
            title="Problem beim Löschen"
            subtitle="Account wurde nicht gelöscht! Bitte versuche es erneut."
            containerStyle={{ margin: '20px auto', maxWidth: 500 }}
          />
        )}
      </div>
    );
  }
}

DeleteAccountButton.propTypes = {
  userId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,

  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(DeleteAccountButton);
