import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { MenuItem, RaisedButton, SelectField } from 'material-ui';
import { distanceInWordsToNow } from 'date-fns';
import de from 'date-fns/locale/de';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import Notification, { NotificationType } from './Notification';

import './ExtraBetCard.css';

export default class ExtraBetCard extends Component {
  static getRemainingTime(deadline) {
    return distanceInWordsToNow(deadline, { locale: de });
  }

  constructor(props) {
    super(props);
    this.state = {
      deadlineCountdownIntervalId: null,
      remainingTime: ExtraBetCard.getRemainingTime(props.deadline),
      userBet: null,
      hasChanges: false,

      loadingError: false,
      savingSuccess: false,
      savingError: false,
      isSaving: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchUserBet();
    this.registerCountdown();
  }

  componentWillUnmount() {
    clearInterval(this.state.deadlineCountdownIntervalId);
  }

  fetchUserBet() {
    return fetch(`${API_BASE_URL}/rtg/bets/?bettable=${this.props.id}`, {
      headers: { Authorization: `Token ${AuthService.getToken()}` },
    }).then(FetchHelper.parseJson)
      .then((response) => {
        this.setState(() => (
          response.ok ?
            { userBet: response.json.length > 0 ? response.json[0] : null }
            : { loadingError: true }
        ));
      }).catch(() => this.setState({ loadingError: true }));
  }

  registerCountdown() {
    const intervalId = setInterval(() => {
      this.setState((prevState, prevProps) => (
        { remainingTime: ExtraBetCard.getRemainingTime(prevProps.deadline) }));
    }, 10000);
    this.setState({ deadlineCountdownIntervalId: intervalId });
  }

  handleChange(event, index, value) {
    this.setState((prevState) => {
      const prevUserBet = prevState.userBet || { result_bet: null };
      const userBet = Object.assign({}, prevUserBet);
      userBet.result_bet = value;
      return { userBet, hasChanges: value !== prevUserBet.result_bet, savingError: false };
    });
  }

  handleSave() {
    if (this.state.userBet && !this.state.isSaving) {
      this.setState({ isSaving: true, savingSuccess: false, savingError: false });

      const newBet = this.state.userBet.result_bet;
      const body = newBet !== null ? { bettable: this.props.id, result_bet: newBet } : null;

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

  render() {
    const userResultBet = this.state.userBet ? this.state.userBet.result_bet : null;
    const isUserBetCorrect = this.props.result && userResultBet === this.props.result;
    const resultInfo = this.props.result ? (
      <div className={`ExtraBetCard__result-info--finished ${isUserBetCorrect ? 'volltreffer' : ''}`}>
        Ergebnis: {this.props.result} - {isUserBetCorrect ? `${this.props.points} Punkte!` : 'Keine Punkte.'}
      </div>)
      : <div className="ExtraBetCard__result-info">Noch kein Ergebnis.</div>;

    return (
      <Card className="ExtraBetCard">
        <CardTitle title={this.props.name} subtitle={`${this.props.points} Punkte - Noch ${this.state.remainingTime}`} />
        {!this.props.open && <CardText style={{ padding: 0 }}>{resultInfo}</CardText>}

        {this.state.loadingError &&
          <div className="ExtraBetCard__loading-error">Fehler beim Laden.</div>}

        {(!this.state.loadingError && this.props.open) &&
          <CardActions
            className="ExtraBetCard__actions"
            style={{ padding: '0 20px 10px' }}
          >
            <SelectField
              floatingLabelText="Dein Tipp"
              maxHeight={300}
              value={userResultBet}
              onChange={this.handleChange}
              menuItemStyle={{ textAlign: 'left' }}
              style={{ marginBottom: '20px' }}
            >
              <MenuItem value={null} primaryText="" />
              {this.props.choices
                .map(choice => <MenuItem key={choice} value={choice} primaryText={choice} />)}
            </SelectField>
            <div>
              <RaisedButton
                label="Speichern"
                primary
                onClick={this.handleSave}
                disabled={this.state.isSaving || !this.state.hasChanges}
                style={{ margin: '0 15px' }}
              />
            </div>
          </CardActions>
        }
        <div>
          {this.state.savingSuccess &&
            <Notification
              type={NotificationType.SUCCESS}
              title="Gespeichert!"
              disappearAfterMs={3000}
            />}
          {this.state.savingError &&
            <Notification
              type={NotificationType.ERROR}
              title="Fehler beim Speichern"
              subtitle="Bitte versuche es später erneut."
            />}
        </div>

        {(!this.state.loadingError && !this.props.open) &&
          <div className="ExtraBetCard__bet-info">Dein Tipp:
            <span className="ExtraBetCard__bet-info-bet">
              {(this.state.userBet && this.state.userBet.result_bet) ? this.state.userBet.result_bet : '---'}
            </span>
          </div>}
      </Card>);
  }
}

ExtraBetCard.defaultProps = {
  result: null,
};

ExtraBetCard.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.number.isRequired,
  deadline: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  points: PropTypes.number.isRequired,
  result: PropTypes.string,

  onBetAdded: PropTypes.func.isRequired,
  onBetRemoved: PropTypes.func.isRequired,
};
