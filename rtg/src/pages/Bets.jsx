import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'material-ui/Tabs';
import { Badge } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Page from './Page';
import BigPicture from '../components/BigPicture';
import GameBetsTab from '../components/GameBetsTab';
import ExtraBetsTab from '../components/ExtraBetsTab';

import headingImg from '../theme/img/img7.jpg';
import './Bets.css';

export const BettableTypes = {
  GAME: 'game',
  EXTRA: 'extra',
};

export const countOpenBets = (bettables, allBets) => {
  const allBetBettablesIds = new Set(allBets.map(bet => bet.bettable));
  return bettables.filter(bettable => !allBetBettablesIds.has(bettable.id)).length;
};

class Bets extends Component {
  static openBetsBadge(title, count) {
    if (count > 0) {
      return <Badge badgeContent={count} secondary badgeStyle={{ top: '10px' }}>{title}</Badge>;
    }
    return title;
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: BettableTypes.GAME,
      openGameBetsCt: 0,
      openExtraBetsCt: 0,
    };
  }

  render() {
    return (
      <Page className="BetsPage">
        <BigPicture className="BetsPage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Deine Tipps</h1>
        </BigPicture>
        <section className="BetsPage__bets-area">
          <Tabs className="BetsPage__tabs" value={this.state.activeTab}>
            <Tab
              className="BetsPage__tab"
              label={Bets.openBetsBadge('Spiele', this.state.openGameBetsCt)}
              value={BettableTypes.GAME}
              onActive={tab => this.setState({ activeTab: tab.props.value })}
            >
              <GameBetsTab
                active={this.state.activeTab === BettableTypes.GAME}
                onOpenBetsUpdate={openBets => this.setState({ openGameBetsCt: openBets })}
                onOpenBetsUpdateIncremental={openBetsChange => this.setState(prevState =>
                  ({ openGameBetsCt: prevState.openGameBetsCt + openBetsChange }))}
              />
            </Tab>
            <Tab
              className="BetsPage__tab"
              label={Bets.openBetsBadge('Zusatztipps', this.state.openExtraBetsCt)}
              value={BettableTypes.EXTRA}
              onActive={tab => this.setState({ activeTab: tab.props.value })}
            >
              <ExtraBetsTab
                active={this.state.activeTab === BettableTypes.EXTRA}
                onOpenBetsUpdate={openBets => this.setState({ openExtraBetsCt: openBets })}
                onOpenBetsUpdateIncremental={openBetsChange => this.setState(prevState =>
                  ({ openExtraBetsCt: prevState.openExtraBetsCt + openBetsChange }))}
              />
            </Tab>
          </Tabs>
        </section>
      </Page>
    );
  }
}

Bets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired,
};

export default muiThemeable()(Bets);
