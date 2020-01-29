import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { addMinutes, format, isAfter, isBefore, } from 'date-fns';

import { withTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import GameCardRibbon from './GameCardRibbon';

import crown from '../theme/img/crown.svg';
import './GameCardGameInfo.scss';

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
const GameCardGameInfo = ({
  city, kickoff, points, result, resultBetType, theme, userBet,
}) => {
  const now = new Date();
  const gameHasStarted = () => isAfter(now, kickoff);

  const gameIsRunning = () => {
    if (result) return false;
    // return false if game has no result but has startet at least 2.5 hrs ago
    // then it usually must be finished and something is wrong with fetching the
    // result - or it was cancelled.
    return isAfter(now, kickoff) && isBefore(now, addMinutes(kickoff, 150));
  };

  const getStateByResultBetType = (type) => {
    if (!gameHasStarted() || !result) {
      return StateEnum.NEUTRAL;
    }

    if (type === StateEnum.VOLLTREFFER) { return StateEnum.VOLLTREFFER; }
    if (type === StateEnum.DIFFERENZ) { return StateEnum.DIFFERENZ; }
    if (type === StateEnum.REMIS_TENDENZ) { return StateEnum.REMIS_TENDENZ; }
    if (type === StateEnum.TENDENZ) { return StateEnum.TENDENZ; }
    return StateEnum.NIETE;
  };

  return (
    <GameCardRibbon stateCssClass={getStateByResultBetType(resultBetType)}>
      <div className="GameCardGameInfo">
        <div className="GameCardGameInfo__userBet" style={{ color: theme.palette.common.white }}>
          <PersonIcon
            color="inherit"
            style={{ width: 16, height: 16, marginTop: 2 }}
          />
          &nbsp;
          {userBet || '-:-'}
        </div>

        {result && <div className="GameCardGameInfo__result">{result}</div>}
        {(!result && !gameIsRunning()) && (
          <div className="GameCardGameInfo__kickoff">{format(kickoff, 'HH:mm')}</div>
        )}
        {gameIsRunning() && (
          <Fragment>
            <div className="GameCardGameInfo__game-running-crown">
              <img src={crown} alt="Icon Krone" />
            </div>
            <div className="GameCardGameInfo__game-running-text">Spiel läuft...</div>
          </Fragment>
        )}

        {result && (
          <Avatar
            className="GameCardGameInfo__points"
            style={{
              backgroundColor: 'transparent',
              width: 25,
              height: 25,
              fontSize: 12,
            }}
          >
            {points || 0}
          </Avatar>)}

        {(!result && !gameIsRunning()) && <div className="GameCardGameInfo__city">{city}</div>}
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

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(GameCardGameInfo);
