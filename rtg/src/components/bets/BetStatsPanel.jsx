import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatButton } from 'material-ui';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import StandingsTable from '../standings/StandingsTable';
import AuthService, { API_BASE_URL } from '../../service/AuthService';
import FetchHelper from '../../service/FetchHelper';

import './BetStatsPanel.css';

// TODO P2 style loading and loading error state
class BetStatsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bets: [],
      loading: true,
      loadingError: false,
    };
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
          return { loading: false, bets: response.json };
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
      <section className={`BetStatsPanel ${this.props.open ? 'open' : ''}`}>
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

        {this.props.open &&
          <div>
            <p>Das haben die anderen Mitspieler getippt:</p>
            <StandingsTable
              scrollable
              showOnlyUserExcerpt
              showBetColumnForBettable={this.props.bettableId}
              showTableHeader={false}
              showStatsColumns={false}
              showUserInfoOnClick={false}
              userExcerptRows={6}
              rowHeight={35}
            />
          </div>}
      </section>
    );
  }
}

BetStatsPanel.defaultProps = {
  onClose: () => {},
  onOpen: () => {},
};

BetStatsPanel.propTypes = {
  bettableId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,

  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default BetStatsPanel;
