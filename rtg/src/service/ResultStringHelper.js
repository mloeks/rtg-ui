export const RESULT_SEPARATOR = ':';
export const NO_GOALS_STRING = '-';
export const NO_GOALS_INT = -1;

export const isCompleteResult = resultString => `^\\d{1,2}${RESULT_SEPARATOR}\\d{1,2}$`.test(resultString);

export const isEmptyResult = resultString =>
  `^${NO_GOALS_STRING}${RESULT_SEPARATOR}${NO_GOALS_STRING}$`.test(resultString);

export const toResultString = (homegoals, awaygoals) => {
  const homegoalsString = (!homegoals || homegoals === NO_GOALS_INT) ? NO_GOALS_STRING : homegoals;
  const awaygoalsString = (!awaygoals || awaygoals === NO_GOALS_INT) ? NO_GOALS_STRING : awaygoals;
  return `${homegoalsString}${RESULT_SEPARATOR}${awaygoalsString}`;
};

export const inputToGoals = (input) => {
  if (typeof input === 'number') {
    return input < 0 ? -1 : input;
  }
  return -1;
};

export const getHomegoals = (resultString) => {
  if (!resultString || typeof resultString !== 'string') { return NO_GOALS_INT; }
  const homegoals = resultString.split(RESULT_SEPARATOR)[0];
  return homegoals !== NO_GOALS_STRING ? homegoals : NO_GOALS_INT;
};

export const getAwaygoals = (resultString) => {
  if (!resultString || typeof resultString !== 'string') { return NO_GOALS_INT; }
  const awaygoals = resultString.split(RESULT_SEPARATOR)[1];
  return awaygoals !== NO_GOALS_STRING ? awaygoals : NO_GOALS_INT;
};

export const setHomegoals = (resultString, homegoalsInput) => {
  return !resultString
    ? toResultString(inputToGoals(homegoalsInput), -1)
    : toResultString(inputToGoals(homegoalsInput), getAwaygoals(resultString));
};

export const setAwaygoals = (resultString, awaygoalsInput) => {
  return !resultString
    ? toResultString(-1, inputToGoals(awaygoalsInput))
    : toResultString(getHomegoals(resultString), inputToGoals(awaygoalsInput));
};

export const getGoalsString = goals => (Number(goals) < 0 ? NO_GOALS_STRING : goals);