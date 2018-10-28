import React from 'react';
import PropTypes from 'prop-types';

import withMobileDialog from '@material-ui/core/withMobileDialog/index';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const DeleteConfirmationModal = ({
  fullScreen, onCancel, onConfirm, open, username,
}) => (
  <Dialog
    fullScreen={fullScreen}
    open={open}
    aria-labelledby="DeleteConfirmationModal__title"
    onClose={onCancel}
  >
    <DialogTitle id="DeleteConfirmationModal__title">Löschen bestätigen</DialogTitle>
    <DialogContent>
      {`"${username}" endgültig löschen?`}
      <br />
      Dies kann nicht rückgängig gemacht werden!
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Abbrechen</Button>
      <Button color="primary" onClick={onConfirm}>User löschen</Button>
    </DialogActions>
  </Dialog>
);

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,

  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(DeleteConfirmationModal);
