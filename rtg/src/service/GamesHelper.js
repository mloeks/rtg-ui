import { differenceInMinutes, toDate } from 'date-fns';

// input is an array of game kickoffs only
// kickoffs can be in any format that date-fns's parse method supports:
const getClosestGameIndex = (gameKickoffDates, referenceDate = new Date()) => {
  if (!gameKickoffDates.length) return -1;

  let closestIndex = 0;
  let closestKickoffAbsDifference = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < gameKickoffDates.length; i += 1) {
    const distance = differenceInMinutes(toDate(gameKickoffDates[i]), referenceDate);

    if (distance < 0 && distance > -135) {
      // If there is a currently running game or a game which has just finished, use this
      // and stop immediately. This way running (or just finished) games are preferred
      // over follow-up games which kickoff might be closer.
      closestIndex = i;
      break;
    }
    if (Math.abs(distance) > closestKickoffAbsDifference) {
      // since the kickoffs are ordered chronologically,
      // we can immediately stop if the absolute difference gets larger.
      break;
    }
    closestKickoffAbsDifference = Math.abs(distance);
    closestIndex = i;
  }

  return closestIndex;
};

export default getClosestGameIndex;
