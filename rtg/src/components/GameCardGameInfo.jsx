import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { addMinutes, format, isAfter, isBefore } from 'date-fns';
import { Avatar } from 'material-ui';
import Person from 'material-ui/svg-icons/social/person';
import GameCardRibbon from './GameCardRibbon';
import { white } from '../theme/RtgTheme';

import crown from '../theme/img/crown.svg';
import './GameCardGameInfo.css';

export const StateEnum = {
  NEUTRAL: 'neutral',
  NIETE: 'niete',
  TENDENZ: 'tendenz',
  REMIS_TENDENZ: 'remis_tendenz',
  DIFFERENZ: 'differenz',
  VOLLTREFFER: 'volltreffer',
};

// TODO P3 setTimeout for updating game running state if deadline is close
// this way the game switches to "running" without the need to reload the page
const GameCardGameInfo = (props) => {
  const now = new Date();
  const gameHasStarted = () => isAfter(now, props.kickoff);

  const gameIsRunning = () => {
    if (props.result) return false;
    // return false if game has no result but has startet at least 2.5 hrs ago
    // then it usually must be finished and something is wrong with fetching the
    // result - or it was cancelled.
    return isAfter(now, props.kickoff) && isBefore(now, addMinutes(props.kickoff, 150));
  };

  const getStateByResultBetType = (resultBetType) => {
    if (!gameHasStarted() || !props.result) {
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
    }
    return StateEnum.NIETE;
  };

  return (
    <GameCardRibbon stateCssClass={getStateByResultBetType(props.resultBetType)}>
      <div className="GameCardGameInfo">
        <div className="GameCardGameInfo__userBet">
          <Person
            style={{ width: '16px', height: '16px', marginTop: '2px' }}
            color={white}
          />&nbsp;{props.userBet || '-:-'}
        </div>

        {props.result &&
          <div className="GameCardGameInfo__result">{props.result}</div>}
        {(!props.result && !gameIsRunning()) &&
          <div className="GameCardGameInfo__kickoff">{format(props.kickoff, 'HH:mm')}</div>}
        {gameIsRunning() && (
          <Fragment>
            <div className="GameCardGameInfo__game-running-crown">
              <img src={crown} alt="Icon Krone" />
            </div>
            <div className="GameCardGameInfo__game-running-text">Spiel läuft...</div>
          </Fragment>)}

        {props.result && (
          <Avatar
            className="GameCardGameInfo__points"
            backgroundColor="transparent"
            size={25}
          >{props.points || 0}
          </Avatar>)}

        {(!props.result && !gameIsRunning()) &&
          <div className="GameCardGameInfo__city">{props.city}</div>}
      </div>
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
