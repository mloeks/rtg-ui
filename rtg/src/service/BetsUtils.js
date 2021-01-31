import React from 'react';

export const BetsStatusContext = React.createContext();

export const BettableTypes = {
  GAME: 'game',
  EXTRA: 'extra',
};

export const countOpenBets = (bettables, allBets) => {
  const allBetBettablesIds = new Set(allBets.map((bet) => bet.bettable));
  return bettables.filter((bettable) => !allBetBettablesIds.has(bettable.id)).length;
};

export const unsavedChangesConfirmText = 'Du hast noch ungespeicherte Tipps. Wirklich fortfahren?';
