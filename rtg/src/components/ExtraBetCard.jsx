import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { MenuItem, RaisedButton, SelectField } from 'material-ui';
import { distanceInWordsToNow } from 'date-fns';
import de from 'date-fns/locale/de';

import './ExtraBetCard.css';
import AuthService, { API_BASE_URL } from "../service/AuthService";
import FetchHelper from "../service/FetchHelper";

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
      savingError: false,
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
            { userBet: response.json.length > 0 ? response.json[0].result_bet : null }
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
    this.setState({ userBet: value, hasChanges: true });
  }

  handleSave() {
    // TODO
  }

  render() {
    // TODO show user points and set color of result info accordingly
    const isUserBetCorrect =
      this.props.result && this.state.userBet && this.state.userBet === this.props.result;
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
          <CardActions className="ExtraBetCard__actions">
            <SelectField
              floatingLabelText="Dein Tipp"
              value={this.state.userBet}
              onChange={this.handleChange}
              menuItemStyle={{ textAlign: 'left' }}
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
                disabled={!this.state.hasChanges}
              />
            </div>
          </CardActions>}

        {(!this.state.loadingError && !this.props.open) &&
          <div className="ExtraBetCard__bet-info">
            Dein Tipp: <span className="ExtraBetCard__bet-info-bet">{this.state.userBet ? this.state.userBet : '---'}</span>
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
};
