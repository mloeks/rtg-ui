import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'material-ui/Tabs';
import { Badge } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Page from './Page';
import { UserDetailsContext } from '../components/providers/UserDetailsProvider';
import BigPicture from '../components/BigPicture';
import GameBetsTab from '../components/GameBetsTab';
import ExtraBetsTab from '../components/ExtraBetsTab';

import headingImg from '../theme/img/headings/royals_stadium.jpg';
import './Bets.css';

export const BettableTypes = {
  GAME: 'game',
  EXTRA: 'extra',
};

export const countOpenBets = (bettables, allBets) => {
  const allBetBettablesIds = new Set(allBets.map(bet => bet.bettable));
  return bettables.filter(bettable => !allBetBettablesIds.has(bettable.id)).length;
};

// TODO P1 Clean up tabs title style with badge
// TODO P2 make tabs header also sticky
// TODO P2 show prompt if user wants to navigate away with unsaved changes
// tried with updating "hasChanged" in this state by the GameCardBet's
// --> too many updates all the time
// but that should be possible with a better implementation
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

    this.handleExtraBetTabClick = this.handleExtraBetTabClick.bind(this);
    this.handleOpenGameBetsCtUpdate = this.handleOpenGameBetsCtUpdate.bind(this);
    this.handleOpenExtraBetsCtUpdate = this.handleOpenExtraBetsCtUpdate.bind(this);
  }

  handleExtraBetTabClick(tab) {
    if (true) {
      this.setState({ activeTab: tab.props.value });
    }
  }

  handleOpenGameBetsCtUpdate(value, incremental, userContext) {
    this.setState(prevState => (
      { openGameBetsCt: incremental ? prevState.openGameBetsCt + value : value }
    ), () => {
      userContext.updateOpenBetsCount(this.state.openExtraBetsCt + this.state.openGameBetsCt);
    });
  }

  handleOpenExtraBetsCtUpdate(value, incremental, userContext) {
    this.setState(prevState => (
      { openExtraBetsCt: incremental ? prevState.openExtraBetsCt + value : value }
    ), () => {
      userContext.updateOpenBetsCount(this.state.openExtraBetsCt + this.state.openGameBetsCt);
    });
  }

  render() {
    return (
      <Page className="BetsPage">
        <BigPicture className="BetsPage__heading" img={headingImg}>
          <h1 className="BigPicture__heading">Deine Tipps</h1>
        </BigPicture>
        <section className="BetsPage__bets-area">
          <UserDetailsContext.Consumer>
            {userContext => (
              <Tabs className="BetsPage__tabs" value={this.state.activeTab}>
                <Tab
                  className="BetsPage__tab"
                  label={Bets.openBetsBadge('Spiele', this.state.openGameBetsCt)}
                  value={BettableTypes.GAME}
                  onActive={tab => this.setState({ activeTab: tab.props.value })}
                >
                  <GameBetsTab
                    active={this.state.activeTab === BettableTypes.GAME}
                    onOpenBetsUpdate={(val, inc) =>
                      this.handleOpenGameBetsCtUpdate(val, inc, userContext)}
                  />
                </Tab>
                <Tab
                  className="BetsPage__tab"
                  label={Bets.openBetsBadge('Zusatztipps', this.state.openExtraBetsCt)}
                  value={BettableTypes.EXTRA}
                  onActive={this.handleExtraBetTabClick}
                >
                  <ExtraBetsTab
                    active={this.state.activeTab === BettableTypes.EXTRA}
                    onOpenBetsUpdate={(val, inc) =>
                      this.handleOpenExtraBetsCtUpdate(val, inc, userContext)}
                  />
                </Tab>
              </Tabs>
            )}
          </UserDetailsContext.Consumer>
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
