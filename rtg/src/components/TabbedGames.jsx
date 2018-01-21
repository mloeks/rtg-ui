import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'material-ui/Tabs';
import GameCard from './GameCard';

const TabbedGames = (props) => {
  const createGameCards = (games, tab, filterFunc) => games
    .filter(game => filterFunc(game) === tab)
    .map(game => <GameCard key={game.id} {...game} />);

  return (
    <Tabs>
      {props.tabs.map(tab => (
        <Tab key={tab} label={tab}>
          {createGameCards(props.games, tab, props.tabResolver)}
        </Tab>
      ))}
    </Tabs>
  );
};

TabbedGames.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  tabResolver: PropTypes.func.isRequired,
};

export default TabbedGames;
