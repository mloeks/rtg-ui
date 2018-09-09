import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ErrorIcon from '@material-ui/icons/Error';
import { SavingErrorType } from '../GameCardBet';
import { error } from '../../theme/RtgTheme';

const SavingIssuesDialog = (props) => {
  const errorTextBySaveType = (saveType, detail) => {
    if (saveType === SavingErrorType.INCOMPLETE) {
      return 'Der Tipp ist unvollständig.';
    }
    if (saveType === SavingErrorType.DEADLINE_PASSED) {
      return 'Die Deadline ist abgelaufen.';
    }
    return detail || 'Ein Fehler ist aufgetreten.';
  };
  const gamesCount = props.games.length;

  return (
    <Dialog
      actions={[<Button onClick={props.onClose}>Schließen</Button>]}
      autoScrollBodyContent
      modal
      open={props.open}
      title={<h2 style={{ textAlign: 'center' }}>Probleme beim Speichern</h2>}
      style={{ textAlign: 'left' }}
      contentStyle={{ width: '95%' }}
    >
      <div>
        <p>
          {gamesCount === 1 ? 'Einer Deiner Tipps konnte ' : 'Einige Deiner Tipps konnten '}
          leider nicht gespeichert werden:
        </p>
        <Divider />
        {props.games.map(game => (
          <ListItem
            key={game.id}
            leftIcon={<ErrorIcon color={error} />}
            primaryText={`${game.hometeam_name} ${game.newBet} ${game.awayteam_name}`}
            secondaryText={errorTextBySaveType(game.saveType, game.responseDetail)}
          />
        ))}
      </div>
    </Dialog>
  );
};

SavingIssuesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  games: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SavingIssuesDialog;
