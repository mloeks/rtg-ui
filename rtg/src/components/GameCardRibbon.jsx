import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import './GameCardRibbon.css';

const StateEnum = {
  NEUTRAL: 'neutral',
  NIETE: 'niete',
  TENDENZ: 'tendenz',
  DIFFERENZ: 'differenz',
  VOLLTREFFER: 'volltreffer',
};

const GameCardRibbon = (props) => {
  // TODO pass user bet, result & resultBetType in
  const state = props.result === null ? StateEnum.NEUTRAL : StateEnum.NEUTRAL;

  let ribbonContent;
  if (props.result === null) {
    ribbonContent = (
      <div className="GameCardRibbon__content">
        <div className="GameCardRibbon__kickoff">{format(props.kickoff, 'HH:mm')}</div>
        <div className="GameCardRibbon__city">{props.city}</div>
      </div>
    );
  } else {
    ribbonContent = (
      <div className="GameCardRibbon__content">
        <div className="GameCardRibbon__result">{props.result}</div>
        <div className="GameCardRibbon__userBet">( {props.userBet || '3 - 4'} )</div>
        <div className="GameCardRibbon__points">{props.points} Pkt.</div>
      </div>
    );
  }

  return (
    <div className={`GameCardRibbon ${state}`}>
      {ribbonContent}
      <div className="GameCardRibbon__right" />
    </div>
  );
};

GameCardRibbon.defaultProps = {
  points: 0,
  result: null,
  resultBetType: null,
  userBet: null,
};

GameCardRibbon.propTypes = {
  city: PropTypes.string.isRequired,
  kickoff: PropTypes.instanceOf(Date).isRequired,
  points: PropTypes.number,
  result: PropTypes.string,
  resultBetType: PropTypes.string,
  userBet: PropTypes.string,
};

export default GameCardRibbon;
