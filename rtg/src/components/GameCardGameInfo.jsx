import React from 'react';
import PropTypes from 'prop-types';
import { format, isAfter } from 'date-fns';
import Person from 'material-ui/svg-icons/social/person';
import GameCardRibbon from './GameCardRibbon';
import { white } from '../theme/RtgTheme';

import './GameCardGameInfo.css';

const StateEnum = {
  NEUTRAL: 'neutral',
  NIETE: 'niete',
  TENDENZ: 'tendenz',
  REMIS_TENDENZ: 'remis_tendenz',
  DIFFERENZ: 'differenz',
  VOLLTREFFER: 'volltreffer',
};

// TODO P2 handle display of running games and games which have started but no result
const GameCardGameInfo = (props) => {
  const gameHasStarted = () => isAfter(new Date(), props.kickoff);

  const getStateByResultBetType = (resultBetType) => {
    if (resultBetType === null || !gameHasStarted()) {
      return StateEnum.NEUTRAL;
    }

    if (resultBetType === StateEnum.VOLLTREFFER) {
      return StateEnum.VOLLTREFFER;
    } else if (resultBetType === StateEnum.DIFFERENZ) {
      return StateEnum.DIFFERENZ;
    } else if (resultBetType === StateEnum.REMIS_TENDENZ) {
      return StateEnum.REMIS_TENDENZ;
    } else if (resultBetType === StateEnum.TENDENZ) {
      return StateEnum.TENDENZ;
    } else if (resultBetType === StateEnum.NIETE) {
      return StateEnum.NIETE;
    }
    return StateEnum.NEUTRAL;
  };

  const userBetDiv = (
    <div className="GameCardGameInfo__userBet">
      <Person style={{ width: '14px' }} color={white} />&nbsp;{props.userBet || '-:-'}
    </div>
  );

  let ribbonContent;
  if (!gameHasStarted()) {
    ribbonContent = (
      <div className="GameCardGameInfo">
        {userBetDiv}
        <div className="GameCardGameInfo__kickoff">{format(props.kickoff, 'HH:mm')}</div>
        <div className="GameCardGameInfo__city">{props.city}</div>
      </div>
    );
  } else if (props.result) {
    ribbonContent = (
      <div className="GameCardGameInfo">
        <div className="GameCardGameInfo__userBet">{props.userBet || '-:-'}</div>
        <div className="GameCardGameInfo__result">{props.result}</div>
        <div className="GameCardGameInfo__points">{props.points}</div>
      </div>
    );
  } else {
    ribbonContent = (
      <div className="GameCardGameInfo">
        <div className="GameCardGameInfo__userBet">{props.userBet || '-:-'}</div>
        <div className="GameCardGameInfo__game-running-crown">Krone</div>
        <div className="GameCardGameInfo__game-running-text">Spiel läuft...</div>
      </div>
    );
  }

  return (
    <GameCardRibbon stateCssClass={getStateByResultBetType(props.resultBetType)}>
      {ribbonContent}
    </GameCardRibbon>
  );
};

GameCardGameInfo.defaultProps = {
  points: 0,
  result: null,
  resultBetType: null,
  userBet: null,
};

GameCardGameInfo.propTypes = {
  city: PropTypes.string.isRequired,
  kickoff: PropTypes.instanceOf(Date).isRequired,
  points: PropTypes.number,
  result: PropTypes.string,
  resultBetType: PropTypes.string,
  userBet: PropTypes.string,
};

export default GameCardGameInfo;
