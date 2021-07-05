import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import GameCard from '../GameCard';
import {
  getAwaygoals,
  getHomegoals,
  isCompleteResult,
  isEmptyResult,
} from '../../service/ResultStringHelper';

import GameCardScoreEditor from '../GameCardScoreEditor';
import Notification, { NotificationType } from '../Notification';

class GameCardResult extends Component {
  constructor(props) {
    super(props);

    const { resultValue } = this.props;

    this.state = {
      result: resultValue,
      hasChanges: false,
      isSaving: false,
      savingSuccess: null,
    };

    this.processResultSaveSuccess = this.processResultSaveSuccess.bind(this);
    this.processResultSaveFailure = this.processResultSaveFailure.bind(this);
    this.save = this.save.bind(this);
  }

  save() {
    const { isSaving, result } = this.state;
    const { gameId } = this.props;

    if (!isSaving) {
      const emptyResult = isEmptyResult(result);

      if (!emptyResult && !isCompleteResult(result)) {
        this.processResultSaveFailure();
        return;
      }

      this.setState({ isSaving: true });

      const payload = {
        homegoals: getHomegoals(result),
        awaygoals: getAwaygoals(result),
      };

      fetch(`${API_BASE_URL}/rtg/games/${gameId}/`, {
        headers: {
          Authorization: `Token ${AuthService.getToken()}`,
          'content-type': 'application/json',
        },
        method: emptyResult ? 'DELETE' : 'PATCH',
        body: JSON.stringify(emptyResult ? null : { payload }),
      }).then(FetchHelper.parseJson)
        .then((response) => {
          if (response.ok) {
            this.processResultSaveSuccess();
          } else {
            this.processResultSaveFailure();
          }
        }).catch(this.processResultSaveFailure);
    }
  }

  processResultSaveSuccess() {
    this.setState({ isSaving: false, savingSuccess: true });
  }

  processResultSaveFailure() {
    this.setState({ isSaving: false, savingSuccess: false });
  }

  render() {
    const { hasChanges, savingSuccess } = this.state;
    const {
      awayteam,
      awayteamAbbrev,
      gameId,
      hometeam,
      hometeamAbbrev,
      resultValue,
    } = this.props;

    return (
      <>
        <GameCard
          hometeam={hometeam}
          hometeamAbbrev={hometeamAbbrev}
          awayteam={awayteam}
          awayteamAbbrev={awayteamAbbrev}
        >
          <GameCardScoreEditor
            gameId={gameId}
            scoreValue={resultValue}
            onChange={(val) => this.setState({ hasChanges: true, result: val })}
          />
        </GameCard>

        {hasChanges && (
          <Button
            color="primary"
            icon={<SaveIcon style={{ width: 20, height: 20 }} />}
            onClick={this.save}
          >
            Speichern
          </Button>
        )}

        {savingSuccess && (
          <Notification
            type={NotificationType.SUCCESS}
            title="Gespeichert"
            dismissable
            disappearAfterMs={2000}
            containerStyle={{ margin: '3px auto', maxWidth: 215 }}
            onClose={() => this.setState({ savingSuccess: null })}
          />
        )}
      </>
    );
  }
}

GameCardResult.defaultProps = {
  resultValue: null,
};

GameCardResult.propTypes = {
  awayteam: PropTypes.string.isRequired,
  awayteamAbbrev: PropTypes.string.isRequired,
  gameId: PropTypes.number.isRequired,
  hometeam: PropTypes.string.isRequired,
  hometeamAbbrev: PropTypes.string.isRequired,
  resultValue: PropTypes.string,
};

export default GameCardResult;
