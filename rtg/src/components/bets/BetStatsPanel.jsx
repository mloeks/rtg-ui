import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PieChart from 'react-minimal-pie-chart';
import StandingsTable from '../standings/StandingsTable';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';
import PieChartLegend from './PieChartLegend';
import { lightenDarkenColor, randomHueHexColor } from '../../service/ColorHelper';
import Notification, { NotificationType } from '../Notification';

import './BetStatsPanel.scss';

// TODO P2 switch between result stats and 2/0/1 stats (for games only)
// TODO P3 implement empty state (no bets placed)
// TODO P3 how to display abbreviations for extra bets? (width on small devices...)
class BetStatsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bets: [],
      chartData: [],
      loading: true,
      loadingError: false,
    };
    this.chartBaseColor = randomHueHexColor(75, 20);
    this.fetchBets = this.fetchBets.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;
    if (!prevProps.open && open) {
      this.fetchBets();
    }
  }

  fetchBets() {
    const { bettableId } = this.props;
    fetch(
      `${API_BASE_URL}/rtg/bets/?bettable=${bettableId}`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then((response) => {
      this.setState(() => {
        if (response.ok) {
          return {
            loading: false,
            bets: response.json,
            chartData: this.aggregateChartData(response.json),
          };
        }
        return { loading: false, loadingError: true };
      });
    }).catch(() => this.setState({ loading: false, loadingError: true }));
  }

  toggleOpen() {
    const { open, onClose, onOpen } = this.props;
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  }

  aggregateChartData(bets) {
    if (!bets) {
      return { value: 100, caption: 'Kein Tipp', color: this.chartBaseColor };
    }

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

    chartData.sort((a, b) => {
      if (a.value > b.value) return -1;
      if (a.value === b.value) return 0;
      return 1;
    });

    let finalChartData = chartData.slice(0, 4);
    const accumulatedRestData = chartData.slice(4);
    if (accumulatedRestData.length > 0) {
      finalChartData = finalChartData
        .concat(accumulatedRestData.reduce((a, b) => ({ value: a.value + b.value, caption: 'Sonstige' })));
    }

    return finalChartData.map((entry, ix) => ({
      value: 100.0 * (entry.value / bets.length),
      caption: entry.caption,
      color: lightenDarkenColor(this.chartBaseColor, (ix + 1) * 35),
    }));
  }

  render() {
    const {
      bets,
      chartData,
      loading,
      loadingError,
    } = this.state;
    const {
      bettableId,
      buttonStyle,
      open,
      standingsBetColumnStyle,
      style,
    } = this.props;

    const legendRowHeight = 25;
    const legendHeight = Math.max(legendRowHeight, chartData.length * legendRowHeight);

    return (
      <section className={`BetStatsPanel ${open ? 'open' : ''}`} style={style}>
        <Button
          color="primary"
          style={{ marginBottom: 10, ...buttonStyle }}
          onClick={this.toggleOpen}
        >
          <KeyboardArrowDownIcon
            style={{
              marginRight: 8,
              width: 22,
              height: 22,
              transform: `rotate(${open ? '180deg' : '0'})`,
              transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          />
          {open ? 'Zuklappen' : 'Alle Tipps ansehen'}
        </Button>

        {open && (
          <div className="BetStatsPanel__inner">
            <p style={{ marginTop: 0 }}>So hat die Gemeinschaft getippt:</p>

            {loading && <CircularProgress />}
            {loadingError && (
              <Notification
                type={NotificationType.ERROR}
                title="Fehler beim Laden"
                subtitle="Bitte versuche es erneut."
              />
            )}

            {!loading && !loadingError && chartData && (
              <>
                <div className="BetStatsPanel__chart-wrapper" style={{ pointerEvents: 'none' }}>
                  <PieChart
                    data={chartData}
                    animate
                    animationDuration={375}
                    animationEasing="cubic-bezier(0.0, 0.0, 0.2, 1) 300ms"
                    lineWidth={15}
                    paddingAngle={3}
                    startAngle={270}
                    style={{ margin: '10px auto', height: 250 }}
                  />
                  <PieChartLegend
                    data={chartData}
                    rowHeight={25}
                    style={{ pointerEvents: 'none' }}
                    containerStyle={{
                      position: 'absolute',
                      top: `calc(50% - ${0.5 * legendHeight}px)`,
                      left: `calc(50% - ${0.5 * 150}px)`,
                      width: 150,
                      height: legendHeight,
                      overflow: 'hidden',
                    }}
                  />
                </div>
                <StandingsTable
                  scrollable
                  showOnlyUserExcerpt
                  showTableHeader={false}
                  showStatsColumns={false}
                  showUserAvatar={false}
                  showUserInfoOnClick={false}
                  userExcerptRows={10}
                  rowHeight={35}

                  showBetColumnForBettable={bettableId}
                  bets={bets}
                  betColumnStyle={standingsBetColumnStyle}
                />
              </>
            )}
          </div>
        )}
      </section>
    );
  }
}

BetStatsPanel.defaultProps = {
  style: {},
  buttonStyle: {},
  standingsBetColumnStyle: {},
  onClose: () => {},
  onOpen: () => {},
};

BetStatsPanel.propTypes = {
  bettableId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,
  buttonStyle: PropTypes.object,
  standingsBetColumnStyle: PropTypes.object,

  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default BetStatsPanel;
