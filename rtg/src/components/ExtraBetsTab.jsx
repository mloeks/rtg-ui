import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import ExtraBetCard from './ExtraBetCard';
import { BettableTypes, countOpenBets } from '../pages/Bets';
import BetStatsPanel from './bets/BetStatsPanel';

// TODO P3 a LOT of this is identical to GameBetsTab --> can a HOC be used?
export default class ExtraBetsTab extends Component {
  static initialState() {
    return {
      bets: [],
      bettables: [],
      extras: [],
      extraIdWithBetStatsOpen: -1,

      loading: true,
      loadingError: '',
    };
  }

  constructor(props) {
    super(props);
    this.state = ExtraBetsTab.initialState();
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  async updateData() {
    const { bets, bettables } = this.state;
    const { onOpenBetsUpdate } = this.props;

    await this.fetchData(`${API_BASE_URL}/rtg/bettables/?bets_open=true`, 'bettables');
    await this.fetchData(`${API_BASE_URL}/rtg/extras/`, 'extras');
    await this.fetchData(`${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}`, 'bets');

    onOpenBetsUpdate(countOpenBets(bettables
      .filter((bettable) => bettable.type === BettableTypes.EXTRA), bets));

    this.setState({ loading: false });
  }

  async fetchData(url, targetStateField) {
    return fetch(url, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ? { [targetStateField]: response.json } : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  render() {
    const {
      extras,
      extraIdWithBetStatsOpen,
      loading,
      loadingError,
    } = this.state;
    const { onOpenBetsUpdate } = this.props;

    return (
      <div className="ExtraBetsTab">
        <div style={{ padding: '0 10px' }}>
          <p>
            Bitte gib alle Zusatztipps&nbsp;
            <b>vor Beginn des Turniers</b>
            &nbsp;ab.
          </p>
        </div>

        <section
          className="ExtraBetsTab__extra-bets-container"
          style={{ paddingBottom: 30 }}
        >
          {loading && (
            <CircularProgress
              className="ExtraBetsTab__loadingSpinner"
              style={{ display: 'block', margin: '30px auto' }}
            />
          )}

          {(!loading && !loadingError) && extras
            .map((extraBet) => (
              <Fragment key={`extra-bet-card-${extraBet.id}`}>
                <ExtraBetCard
                  onBetAdded={() => onOpenBetsUpdate(-1, true)}
                  onBetRemoved={() => onOpenBetsUpdate(1, true)}
                  {...extraBet}
                />
                {(extraBet && !extraBet.open) && (
                  <BetStatsPanel
                    bettableId={extraBet.id}
                    open={extraBet.id === extraIdWithBetStatsOpen}
                    onClose={() => this.setState({ extraIdWithBetStatsOpen: -1 })}
                    onOpen={() => this.setState({ extraIdWithBetStatsOpen: extraBet.id })}
                    style={{ marginTop: -20, maxWidth: 620, textAlign: 'center' }}
                    standingsBetColumnStyle={{ width: '80px' }}
                  />
                )}
              </Fragment>
            ))}
          {loadingError && <div className="ExtraBetsTab__loadingError">Fehler beim Laden.</div>}
        </section>
      </div>
    );
  }
}

ExtraBetsTab.propTypes = {
  onOpenBetsUpdate: PropTypes.func.isRequired,
};
