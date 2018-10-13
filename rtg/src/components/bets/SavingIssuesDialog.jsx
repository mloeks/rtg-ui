import React from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ErrorIcon from '@material-ui/icons/Error';

import { SavingErrorType } from '../GameCardBet';

const SavingIssuesDialog = ({
  fullScreen, games, onClose, open, theme,
}) => {
  const errorTextBySaveType = (saveType, detail) => {
    if (saveType === SavingErrorType.INCOMPLETE) {
      return 'Der Tipp ist unvollständig.';
    }
    if (saveType === SavingErrorType.DEADLINE_PASSED) {
      return 'Die Deadline ist abgelaufen.';
    }
    return detail || 'Ein Fehler ist aufgetreten.';
  };
  const gamesCount = games.length;

  return (
    <Dialog
      aria-labelledby="SavingIssuesDialog__title"
      fullScreen={fullScreen}
      open={open}
      title={<h2 style={{ textAlign: 'center' }}>Probleme beim Speichern</h2>}
      onClose={onClose}
    >
      <DialogTitle id="SavingIssuesDialog__title">
        Probleme beim Speichern
      </DialogTitle>
      <DialogContent>
        <p>
          {gamesCount === 1 ? 'Einer Deiner Tipps konnte ' : 'Einige Deiner Tipps konnten '}
          leider nicht gespeichert werden:
        </p>
        <Divider />
        {games.map(game => (
          <ListItem key={game.id}>
            <ListItemIcon><ErrorIcon style={{ color: theme.palette.error.main }} /></ListItemIcon>
            <ListItemText
              primary={`${game.hometeam_name} ${game.newBet} ${game.awayteam_name}`}
              secondary={errorTextBySaveType(game.saveType, game.responseDetail)}
            />
          </ListItem>
        ))}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
};

SavingIssuesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  games: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,

  fullScreen: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withMobileDialog()(withTheme()(SavingIssuesDialog));
