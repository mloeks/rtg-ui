import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import GameCardRibbon from './GameCardRibbon';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import { NO_GOALS_STRING, RESULT_SEPARATOR } from '../service/ResultStringHelper';

import './GameCardBet.css';
import './GoalInput.css';

const GoalInput = ({ id, goals, type, onChange }) => (
  <TextField
    className="GoalInput__text-field"
    id={id}
    value={goals}
    underlineShow={false}
    onChange={onChange}
    inputStyle={{
      color: '#F2CE00',
      width: '80%',
      textAlign: type === 'home' ? 'right' : 'left',
    }}
  />
);

GoalInput.defaultProps = {
  goals: NO_GOALS_STRING,
  onChange: null,
};

GoalInput.propTypes = {
  id: PropTypes.string.isRequired,
  goals: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

const GameCardBetPresentational = ({
  id, homegoals, awaygoals, onHomegoalsChange, onAwaygoalsChange,
}) => {
  return (
    <GameCardRibbon stateCssClass="bet">
      <div className="GameCardBet">
        <GoalInput
          className="GoalInput GoalInput__home"
          id={`${id}-home`}
          type="home"
          goals={homegoals || undefined}
          onChange={onHomegoalsChange}
        />
        <span>{RESULT_SEPARATOR}</span>
        <GoalInput
          className="GoalInput GoalInput__away"
          id={`${id}-away`}
          type="away"
          goals={awaygoals || undefined}
          onChange={onAwaygoalsChange}
        />
      </div>
    </GameCardRibbon>
  );
};

GameCardBetPresentational.defaultProps = {
  homegoals: null,
  awaygoals: null,
};

GameCardBetPresentational.propTypes = {
  id: PropTypes.number.isRequired,
  homegoals: PropTypes.string,
  awaygoals: PropTypes.string,
  onHomegoalsChange: PropTypes.func.isRequired,
  onAwaygoalsChange: PropTypes.func.isRequired,
};

class GameCardBet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userBet: null,

      homegoalsInput: null,
      awaygoalsInput: null,

      isSaving: false,
      savingError: false,
      loadingError: false,
    };

    this.handleHomegoalsChange = this.handleHomegoalsChange.bind(this);
    this.handleAwaygoalsChange = this.handleAwaygoalsChange.bind(this);
  }

  componentDidMount() {
    this.fetchUserBet();
  }

  fetchUserBet() {
    return fetch(`${API_BASE_URL}/rtg/bets/?bettable=${this.props.gameId}`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ?
            { bet: response.json.length > 0 ? response.json[0] : null }
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  // TODO DRY with ExtraBetCard, introduce BetSavingHelper
  handleSave() {
    if (this.state.userBet && !this.state.isSaving) {
      this.setState({ isSaving: true, savingSuccess: false, savingError: false });

      // TODO do we need to remember the original bet in a separate field?
      const newBet = this.state.userBet;
      const body = newBet !== null ? { bettable: this.props.gameId, result_bet: newBet } : null;

      let method;
      let url = `${API_BASE_URL}/rtg/bets/`;
      if (this.state.userBet.id) {
        url += `${this.state.userBet.id}/`;
        method = newBet !== null ? 'PUT' : 'DELETE';
      } else {
        method = 'POST';
      }

      fetch(url, {
        headers: {
          Authorization: `Token ${AuthService.getToken()}`,
          'content-type': 'application/json',
        },
        method,
        body: JSON.stringify(body),
      }).then(FetchHelper.parseJson)
        .then((response) => {
          if (response.ok) {
            this.setState({
              savingSuccess: true,
              isSaving: false,
              hasChanges: false,
              userBet: response.json || null,
            }, () => {
              if (method === 'POST') {
                this.props.onBetAdded();
              } else if (method === 'DELETE') {
                this.props.onBetRemoved();
              }
            });
          } else {
            this.setState({ savingError: true, isSaving: false });
          }
        }).catch(() => this.setState({ savingError: true, isSaving: false }));
    }
  }

  handleHomegoalsChange(e, value) { this.setState({ homegoalsInput: value }); }
  handleAwaygoalsChange(e, value) { this.setState({ awaygoalsInput: value }); }

  render() {
    return (
      <GameCardBetPresentational
        id={this.props.gameId}
        homegoals={this.state.homegoalsInput}
        awaygoals={this.state.awaygoalsInput}
        onHomegoalsChange={this.handleHomegoalsChange}
        onAwaygoalsChange={this.handleAwaygoalsChange}
      />
    );
  }
}

GameCardBet.propTypes = {
  gameId: PropTypes.number.isRequired,

  onBetAdded: PropTypes.func.isRequired,
  onBetRemoved: PropTypes.func.isRequired,
};

export default GameCardBet;
