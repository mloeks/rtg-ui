export const RESULT_SEPARATOR = ':';
export const NO_GOALS_STRING = '-';

export const isCompleteResult = resultString => new RegExp(`^\\d{1,2}${RESULT_SEPARATOR}\\d{1,2}$`).test(resultString);

export const isEmptyResult = resultString =>
  `${NO_GOALS_STRING}${RESULT_SEPARATOR}${NO_GOALS_STRING}` === resultString;

export const toResultString = (homegoals, awaygoals) => {
  const homegoalsString = !homegoals ? NO_GOALS_STRING : homegoals;
  const awaygoalsString = !awaygoals ? NO_GOALS_STRING : awaygoals;
  return `${homegoalsString}${RESULT_SEPARATOR}${awaygoalsString}`;
};

export const inputToGoals = (input) => {
  if (typeof input === 'number') {
    return input < 0 ? -1 : input;
  }
  return -1;
};

export const getHomegoals = (resultString) => {
  if (!resultString || typeof resultString !== 'string') { return NO_GOALS_STRING; }
  const homegoals = resultString.split(RESULT_SEPARATOR)[0];
  return homegoals !== NO_GOALS_STRING ? homegoals : NO_GOALS_STRING;
};

export const getAwaygoals = (resultString) => {
  if (!resultString || typeof resultString !== 'string') { return NO_GOALS_STRING; }
  const awaygoals = resultString.split(RESULT_SEPARATOR)[1];
  return awaygoals !== NO_GOALS_STRING ? awaygoals : NO_GOALS_STRING;
};

export const getGoalsString = (goals) => {
  if (Number.isNaN(goals) || goals === '') { return NO_GOALS_STRING }
  const goalsNumber = Number(goals);
  if (goalsNumber < 0 || goalsNumber > 10) { return NO_GOALS_STRING; }
  return goals;
};
