import { differenceInMinutes, parse } from 'date-fns';

// input is an array of game kickoffs only
// kickoffs can be in any format that date-fns's parse method supports:
// https://date-fns.org/v1.29.0/docs/parse
export const getClosestGameIndex = (gameKickoffs, referenceDate = new Date()) => {
  if (!gameKickoffs.length) return -1;

  let closestIndex = 0;
  let closestKickoffAbsDifference = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < gameKickoffs.length; i += 1) {
    const distance = differenceInMinutes(parse(gameKickoffs[i]), referenceDate);

    if (distance < 0 && distance > -90) {
      // We found a currently running game. use this and stop immediately. This is important in
      // order to prefer running games over follow-up games which kickoff might be closer.
      closestIndex = i;
      break;
    }
    if (Math.abs(distance) >= closestKickoffAbsDifference) {
      // since the kickoffs are ordered chronologically,
      // we can immediately stop if the absolute difference gets larger.
      break;
    }
    closestKickoffAbsDifference = Math.abs(distance);
    closestIndex = i;
  }

  return closestIndex;
};
