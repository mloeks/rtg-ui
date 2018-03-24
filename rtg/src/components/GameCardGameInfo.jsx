import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import GameCardRibbon from './GameCardRibbon';

import './GameCardGameInfo.css';

const StateEnum = {
  NEUTRAL: 'neutral',
  NIETE: 'niete',
  TENDENZ: 'tendenz',
  DIFFERENZ: 'differenz',
  VOLLTREFFER: 'volltreffer',
};

// TODO P2 handle display of running games and games which have started but no result
const GameCardGameInfo = (props) => {
  const state = props.result === null ? StateEnum.NEUTRAL : StateEnum.NEUTRAL;

  let ribbonContent;
  if (props.result === null) {
    ribbonContent = (
      <div className="GameCardGameInfo">
        <div className="GameCardGameInfo__kickoff">{format(props.kickoff, 'HH:mm')}</div>
        <div className="GameCardGameInfo__city">{props.city}</div>
      </div>
    );
  } else {
    ribbonContent = (
      <div className="GameCardGameInfo">
        <div className="GameCardGameInfo__result">{props.result}</div>
        <div className="GameCardGameInfo__userBet">( {props.userBet || '3 - 4'} )</div>
        <div className="GameCardGameInfo__points">{props.points} Pkt.</div>
      </div>
    );
  }

  return (
    <GameCardRibbon stateCssClass={state}>{ribbonContent}</GameCardRibbon>
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
