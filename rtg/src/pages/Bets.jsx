import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Badge from '@material-ui/core/Badge';

import Page from './Page';
import { UserDetailsContext } from '../components/providers/UserDetailsProvider';
import BigPicture from '../components/BigPicture';
import GameBetsTab from '../components/GameBetsTab';
import ExtraBetsTab from '../components/ExtraBetsTab';
import { BetsStatusContext, unsavedChangesConfirmText } from '../service/BetsUtils';

import headingImg from '../theme/img/headings/my/ancient_clocks.webp';
import './Bets.scss';

const styles = (theme) => ({
  openBetsBadge: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
});

// TODO P3 refactor such that bets are not loaded twice (in each tab once currently...)
// maybe load bets here and pass down as props
class Bets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      openGameBetsCt: 0,
      openExtraBetsCt: 0,
      betsHaveChanges: false,

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

  handleBetsHaveChanges(betsHaveChanges) {
    this.setState({ betsHaveChanges });
  }

  handleTabActive(event, activeTab) {
    const { betsHaveChanges } = this.state;
    // eslint-disable-next-line no-alert
    if (!betsHaveChanges || window.confirm(unsavedChangesConfirmText)) {
      this.setState({ activeTab, betsHaveChanges: false });
    }
  }

  handleOpenGameBetsCtUpdate(value, incremental, userContext) {
    this.setState((prevState) => (
      { openGameBetsCt: incremental ? prevState.openGameBetsCt + value : value }
    ), () => {
      const { openExtraBetsCt, openGameBetsCt } = this.state;
      userContext.updateOpenBetsCount(openExtraBetsCt + openGameBetsCt);
    });
  }

  handleOpenExtraBetsCtUpdate(value, incremental, userContext) {
    this.setState((prevState) => (
      { openExtraBetsCt: incremental ? prevState.openExtraBetsCt + value : value }
    ), () => {
      const { openExtraBetsCt, openGameBetsCt } = this.state;
      userContext.updateOpenBetsCount(openExtraBetsCt + openGameBetsCt);
    });
  }

  confirmNavigationWithUnsavedChanges(e) {
    const { betsHaveChanges } = this.state;
    if (betsHaveChanges) {
      e.returnValue = unsavedChangesConfirmText;
      return unsavedChangesConfirmText;
    }
    return undefined;
  }

  openBetsBadge(title, count) {
    const { classes } = this.props;
    if (count > 0) {
      return (
        <Badge
          classes={{ badge: classes.openBetsBadge }}
          badgeContent={count}
          overlap="rectangular"
          style={{ padding: '0 16px' }}
        >
          {title}
        </Badge>
      );
    }
    return title;
  }

  render() {
    const {
      activeTab,
      betsHaveChanges,
      openExtraBetsCt,
      openGameBetsCt,
      updateBetsHaveChanges,
    } = this.state;

    return (
      <BetsStatusContext.Provider value={{
        activeTab,
        betsHaveChanges,
        openExtraBetsCt,
        openGameBetsCt,
        updateBetsHaveChanges,
      }}
      >
        <Page className="BetsPage">
          <Prompt when={betsHaveChanges} message={unsavedChangesConfirmText} />

          <BigPicture className="BetsPage__heading" img={headingImg} positionY={40}>
            <h2 className="BigPicture__heading">Deine Tipps</h2>
          </BigPicture>

          <section className="BetsPage__bets-area">
            <UserDetailsContext.Consumer>
              {(userContext) => (
                <>
                  <Tabs
                    className="BetsPage__tabs"
                    indicatorColor="secondary"
                    textColor="primary"
                    value={activeTab}
                    variant="fullWidth"
                    onChange={this.handleTabActive}
                  >
                    <Tab label={this.openBetsBadge('Spiele', openGameBetsCt)} />
                    <Tab label={this.openBetsBadge('Zusatztipps', openExtraBetsCt)} />
                  </Tabs>
                  {activeTab === 0 && (
                    <GameBetsTab
                      onOpenBetsUpdate={(val, inc) => this
                        .handleOpenGameBetsCtUpdate(val, inc, userContext)}
                    />
                  )}
                  {activeTab === 1 && (
                    <ExtraBetsTab
                      onOpenBetsUpdate={(val, inc) => this
                        .handleOpenExtraBetsCtUpdate(val, inc, userContext)}
                    />
                  )}
                </>
              )}
            </UserDetailsContext.Consumer>
          </section>
        </Page>
      </BetsStatusContext.Provider>
    );
  }
}

Bets.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(Bets);
