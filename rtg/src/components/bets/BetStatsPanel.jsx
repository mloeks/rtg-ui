import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatButton } from 'material-ui';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import PieChart from 'react-minimal-pie-chart';
import StandingsTable from '../standings/StandingsTable';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import PieChartLegend from './PieChartLegend';
import { lightenDarkenColor, randomHueHexColor } from '../../service/ColorHelper';

import './BetStatsPanel.css';

// TODO P2 style loading and loading error state
// TODO P3 switch between result stats and 2/0/1 stats
class BetStatsPanel extends Component {
  static aggregateChartData(bets) {
    const sortedResults = bets.slice(0).map(b => b.result_bet).sort();
    const chartData = [];

    let previousVal = null;
    let resultIndex = -1;
    sortedResults.forEach((val) => {
      if (previousVal === null || previousVal !== val) {
        chartData.push({ value: 1, caption: val });
        resultIndex += 1;
      } else {
        chartData[resultIndex].value += 1;
      }
      previousVal = val;
    });

    const chartDataSortedByValue = chartData.sort((a, b) => a.value < b.value);
    const finalChartData = [...chartDataSortedByValue.slice(0, 4), chartDataSortedByValue.slice(4)
      .reduce((a, b) => ({ value: a.value + b.value, caption: 'Sonstige' }))];

    const baseColor = randomHueHexColor(75, 20);
    return finalChartData.map((entry, ix) => ({
      value: 100.0 * (entry.value / bets.length),
      caption: entry.caption,
      color: lightenDarkenColor(baseColor, (ix + 1) * 35),
    }));
  }

  constructor(props) {
    super(props);
    this.state = {
      bets: [],
      chartData: [],
      loading: true,
      loadingError: false,
    };
    this.chartData = [];
    this.fetchBets = this.fetchBets.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.fetchBets();
    }
  }

  fetchBets() {
    fetch(
      `${API_BASE_URL}/rtg/bets/?bettable=${this.props.bettableId}`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then((response) => {
      this.setState(() => {
        if (response.ok) {
          return {
            loading: false,
            bets: response.json,
            chartData: BetStatsPanel.aggregateChartData(response.json),
          };
        }
        return { loading: false, loadingError: true };
      });
    }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  toggleOpen() {
    if (this.props.open) {
      this.props.onClose();
    } else {
      this.props.onOpen();
    }
  }

  render() {
    return (
      <section className={`BetStatsPanel ${this.props.open ? 'open' : ''}`} style={this.props.style}>
        <FlatButton
          primary
          icon={<HardwareKeyboardArrowDown
            style={{
              width: 22,
              height: 22,
              transform: `rotate(${this.props.open ? '180deg' : '0'})`,
              transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          />}
          label={this.props.open ? 'Zuklappen' : 'Alle Tipps ansehen'}
          style={{ marginBottom: 10 }}
          onClick={this.toggleOpen}
        />

        {this.props.open && this.state.chartData &&
          <div className="BetStatsPanel__inner">
            <p style={{ marginTop: 0 }}>So hat die Gemeinschaft getippt:</p>
            <div className="BetStatsPanel__chart-wrapper" style={{ pointerEvents: 'none' }}>
              <PieChart
                data={this.state.chartData}
                animate
                animationDuration={375}
                animationEasing="cubic-bezier(0.0, 0.0, 0.2, 1) 300ms"
                lineWidth={15}
                paddingAngle={3}
                startAngle={270}
                style={{ margin: '10px auto', height: 250 }}
              />
              <PieChartLegend
                className="BetStatsPanel__chart-legend"
                data={this.state.chartData}
                style={{ pointerEvents: 'none' }}
              />
            </div>
            <StandingsTable
              scrollable
              showOnlyUserExcerpt
              showTableHeader={false}
              showStatsColumns={false}
              showUserInfoOnClick={false}
              userExcerptRows={6}
              rowHeight={35}

              showBetColumnForBettable={this.props.bettableId}
              bets={this.state.bets}
            />
          </div>}
      </section>
    );
  }
}

BetStatsPanel.defaultProps = {
  style: {},
  onClose: () => {},
  onOpen: () => {},
};

BetStatsPanel.propTypes = {
  bettableId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,

  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default BetStatsPanel;
