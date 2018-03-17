import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import './GameCardInfoRibbon.css';

const StateEnum = {
  NEUTRAL: 'neutral',
  NIETE: 'niete',
  TENDENZ: 'tendenz',
  DIFFERENZ: 'differenz',
  VOLLTREFFER: 'volltreffer',
};

// TODO pass user bet, result & resultBetType in
// TODO handle display of running games and games which have started but no result
const GameCardInfoRibbon = (props) => {
  const state = props.result === null ? StateEnum.NEUTRAL : StateEnum.NEUTRAL;

  let ribbonContent;
  if (props.result === null) {
    ribbonContent = (
      <div className="GameCardInfoRibbon__content">
        <div className="GameCardInfoRibbon__kickoff">{format(props.kickoff, 'HH:mm')}</div>
        <div className="GameCardInfoRibbon__city">{props.city}</div>
      </div>
    );
  } else {
    ribbonContent = (
      <div className="GameCardInfoRibbon__content">
        <div className="GameCardInfoRibbon__result">{props.result}</div>
        <div className="GameCardInfoRibbon__userBet">( {props.userBet || '3 - 4'} )</div>
        <div className="GameCardInfoRibbon__points">{props.points} Pkt.</div>
      </div>
    );
  }

  return (
    <div className={`GameCardInfoRibbon ${state}`}>
      {ribbonContent}
      <div className="GameCardInfoRibbon__right" />
    </div>
  );
};

GameCardInfoRibbon.defaultProps = {
  points: 0,
  result: null,
  resultBetType: null,
  userBet: null,
};

GameCardInfoRibbon.propTypes = {
  city: PropTypes.string.isRequired,
  kickoff: PropTypes.instanceOf(Date).isRequired,
  points: PropTypes.number,
  result: PropTypes.string,
  resultBetType: PropTypes.string,
  userBet: PropTypes.string,
};

export default GameCardInfoRibbon;
