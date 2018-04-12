import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Divider, FlatButton, ListItem } from 'material-ui';
import Error from 'material-ui/svg-icons/alert/error';
import { SavingErrorType } from '../GameCardBet';
import { error } from '../../theme/RtgTheme';

const SavingIssuesDialog = (props) => {
  const errorTextBySaveType = (saveType, detail) => {
    if (saveType === SavingErrorType.INCOMPLETE) {
      return 'Der Tipp ist unvollständig.';
    }
    return detail || 'Ein Fehler ist aufgetreten.';
  };

  return (
    <Dialog
      actions={[<FlatButton label="Schließen" onClick={props.onClose} />]}
      autoScrollBodyContent
      modal
      open={props.open}
      title={<h2 style={{ textAlign: 'center' }}>Probleme beim Speichern</h2>}
      style={{ textAlign: 'left' }}
      contentStyle={{ width: '95%' }}
    >
      <div>
        <p>Einige Deiner Tipps konnten leider nicht gespeichert werden:</p>
        <Divider />
        {props.games.map(game => (
          <ListItem
            key={game.id}
            leftIcon={<Error color={error} />}
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
