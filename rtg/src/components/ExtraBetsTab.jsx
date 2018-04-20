import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import ExtraBetCard from './ExtraBetCard';
import { BettableTypes, countOpenBets } from '../pages/Bets';

import './ExtraBetsTab.css';

// TODO P3 a LOT of this is identical to GameBetsTab --> can a HOC be used?
export default class ExtraBetsTab extends Component {
  static initialState() {
    return {
      bets: [],
      bettables: [],
      extras: [],

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

  // TODO P3 replace by getDerivedStateFromProps, as this will be deprecated
  // that method is static though and my first attempt was unsuccessful in
  // achieving the same behaviour
  // Cf. https://github.com/reactjs/reactjs.org/issues/721
  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      this.setState(ExtraBetsTab.initialState(), () => {
        this.updateData();
      });
    }
  }

  async updateData() {
    await this.fetchData(`${API_BASE_URL}/rtg/bettables/?bets_open=true`, 'bettables');
    await this.fetchData(`${API_BASE_URL}/rtg/extras/`, 'extras');
    await this.fetchData(`${API_BASE_URL}/rtg/bets/`, 'bets');

    this.props.onOpenBetsUpdate(countOpenBets(this.state.bettables
      .filter(bettable => bettable.type === BettableTypes.EXTRA), this.state.bets));

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
    const extraBettables =
      this.state.bettables.filter(bettable => bettable.type === BettableTypes.EXTRA);

    return (
      <div className="ExtraBetsTab">
        <h2>Zusatztipps</h2>
        <p>Hier kannst du Deine Zusatztipps abgeben.</p>

        <section className="ExtraBetsTab__extra-bets-container">
          {this.state.loading &&
            <CircularProgress className="ExtraBetsTab__loadingSpinner" style={{ display: 'block' }} />}

          {(!this.state.loading && !this.state.loadingError) && this.state.extras
            .map(extraBet => (
              <ExtraBetCard
                key={extraBet.id}
                onBetAdded={() => this.props.onOpenBetsUpdateIncremental(-1)}
                onBetRemoved={() => this.props.onOpenBetsUpdateIncremental(1)}
                {...extraBet}
              />
            ))
          }
          {(!this.state.loading && !this.state.loadingError && extraBettables.length === 0) &&
            <div className="ExtraBetsTab__no-games-present">
              Keine offenen Zusatztipps vorhanden.
            </div>
          }
          {this.state.loadingError &&
            <div className="ExtraBetsTab__loadingError">Fehler beim Laden.</div>
          }
        </section>
      </div>
    );
  }
}

ExtraBetsTab.propTypes = {
  active: PropTypes.bool.isRequired,
  onOpenBetsUpdate: PropTypes.func.isRequired,
  onOpenBetsUpdateIncremental: PropTypes.func.isRequired,
};
