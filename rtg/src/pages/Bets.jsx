import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import { Tab, Tabs } from 'material-ui/Tabs';
import { Badge } from 'material-ui';
import Page from './Page';
import { UserDetailsContext } from '../components/providers/UserDetailsProvider';
import BigPicture from '../components/BigPicture';
import GameBetsTab from '../components/GameBetsTab';
import ExtraBetsTab from '../components/ExtraBetsTab';
import { black, error, purple, white } from '../theme/RtgTheme';

import headingImg from '../theme/img/headings/royals_stadium.jpg';
import './Bets.css';

export const BetsStatusContext = React.createContext();

export const BettableTypes = {
  GAME: 'game',
  EXTRA: 'extra',
};

export const countOpenBets = (bettables, allBets) => {
  const allBetBettablesIds = new Set(allBets.map(bet => bet.bettable));
  return bettables.filter(bettable => !allBetBettablesIds.has(bettable.id)).length;
};

export const unsavedChangesConfirmText = 'Du hast noch ungespeicherte Tipps. Wirklich fortfahren?';

// TODO P3 refactor such that bets are not loaded twice (in each tab once currently...)
// maybe load bets here and pass down as props
class Bets extends Component {
  static openBetsBadge(title, count) {
    if (count > 0) {
      return (<Badge
        badgeContent={count}
        badgeStyle={{
          backgroundColor: error,
          color: white,
          top: '3px',
          right: '-25px',
        }}
        style={{ padding: '15px 2px 15px 0' }}
      >{title}</Badge>);
    }
    return title;
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: BettableTypes.GAME,
      openGameBetsCt: 0,
      openExtraBetsCt: 0,
      betsHaveChanges: false,

      // eslint-disable-next-line react/no-unused-state
      updateBetsHaveChanges: this.handleBetsHaveChanges.bind(this),
    };

    this.confirmNavigationWithUnsavedChanges = this.confirmNavigationWithUnsavedChanges.bind(this);
    this.handleTabActive = this.handleTabActive.bind(this);
    this.handleOpenGameBetsCtUpdate = this.handleOpenGameBetsCtUpdate.bind(this);
    this.handleOpenExtraBetsCtUpdate = this.handleOpenExtraBetsCtUpdate.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.confirmNavigationWithUnsavedChanges, false);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.confirmNavigationWithUnsavedChanges, false);
  }

  confirmNavigationWithUnsavedChanges(e) {
    if (this.state.betsHaveChanges) {
      e.returnValue = unsavedChangesConfirmText;
      return unsavedChangesConfirmText;
    }
    return undefined;
  }

  handleBetsHaveChanges(betsHaveChanges) {
    this.setState({ betsHaveChanges });
  }

  handleTabActive(tab) {
    if (!this.state.betsHaveChanges || window.confirm(unsavedChangesConfirmText)) {
      this.setState({ activeTab: tab.props.value, betsHaveChanges: false });
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
      <BetsStatusContext.Provider value={this.state}>
        <Page className="BetsPage">
          <Prompt
            when={this.state.betsHaveChanges}
            message={unsavedChangesConfirmText}
          />

          <BigPicture className="BetsPage__heading" img={headingImg} positionY={25}>
            <h1 className="BigPicture__heading">Deine Tipps</h1>
          </BigPicture>

          <section className="BetsPage__bets-area">
            <UserDetailsContext.Consumer>
              {userContext => (
                <Tabs
                  className="BetsPage__tabs"
                  value={this.state.activeTab}
                  inkBarStyle={{ backgroundColor: purple }}
                  tabItemContainerStyle={{ backgroundColor: white }}
                >
                  <Tab
                    className="BetsPage__tab"
                    label={Bets.openBetsBadge('Spiele', this.state.openGameBetsCt)}
                    value={BettableTypes.GAME}
                    onActive={this.handleTabActive}
                    buttonStyle={{ color: black, height: '60px' }}
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
                    onActive={this.handleTabActive}
                    buttonStyle={{ color: black, height: '60px' }}
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
      </BetsStatusContext.Provider>
    );
  }
}

export default Bets;
