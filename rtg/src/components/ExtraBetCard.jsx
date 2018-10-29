import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import StarIcon from '@material-ui/icons/Star';
import AlarmIcon from '@material-ui/icons/Alarm';

import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import de from 'date-fns/locale/de';
import AuthService, { API_BASE_URL } from '../service/AuthService';
import FetchHelper from '../service/FetchHelper';
import Notification, { NotificationType } from './Notification';
import { BetsStatusContext } from '../pages/Bets';

import './ExtraBetCard.css';

// TODO P3 display country flags in drop down
class ExtraBetCard extends Component {
  static getRemainingTime(deadline) {
    const absoluteDateTime = format(deadline, 'EEEEEE. dd. MMM, HH:mm \'Uhr\'', { locale: de });
    const relativeDistance = formatDistance(deadline, Date.now(), { locale: de });
    return `${relativeDistance} – ${absoluteDateTime}`;
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
    this.createSubtitleDiv = this.createSubtitleDiv.bind(this);
  }

  componentDidMount() {
    this.fetchUserBet();
    this.registerCountdown();
  }

  componentWillUnmount() {
    const { deadlineCountdownIntervalId } = this.state;
    clearInterval(deadlineCountdownIntervalId);
  }

  fetchUserBet() {
    const { id } = this.props;
    return fetch(
      `${API_BASE_URL}/rtg/bets/?user=${AuthService.getUserId()}&bettable=${id}`,
      { headers: { Authorization: `Token ${AuthService.getToken()}` } },
    ).then(FetchHelper.parseJson).then((response) => {
      this.setState(() => (
        response.ok
          ? { userBet: response.json.length > 0 ? response.json[0] : null }
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

  handleChange(value, betsStatusContext) {
    this.setState((prevState) => {
      const prevUserBet = prevState.userBet || { result_bet: null };
      const userBet = Object.assign({}, prevUserBet);
      userBet.result_bet = value;
      return { userBet, hasChanges: value !== prevUserBet.result_bet, savingError: false };
    }, () => {
      if (!betsStatusContext.betsHaveChanges) {
        betsStatusContext.updateBetsHaveChanges(true);
      }
    });
  }

  handleSave(betsStatusContext) {
    const { isSaving, userBet } = this.state;
    const { id, onBetAdded, onBetRemoved } = this.props;

    if (userBet && !isSaving) {
      this.setState({ isSaving: true, savingSuccess: false, savingError: false });

      const newBet = userBet.result_bet;
      const body = newBet !== null ? { bettable: id, result_bet: newBet } : null;

      let method;
      let url = `${API_BASE_URL}/rtg/bets/`;
      if (userBet.id) {
        url += `${userBet.id}/`;
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
              betsStatusContext.updateBetsHaveChanges(false);
              if (method === 'POST') {
                onBetAdded();
              } else if (method === 'DELETE') {
                onBetRemoved();
              }
            });
          } else {
            this.setState({ savingError: true, isSaving: false });
          }
        }).catch(() => this.setState({ savingError: true, isSaving: false }));
    }
  }

  createSubtitleDiv() {
    const { open, points, theme } = this.props;
    const { remainingTime } = this.state;

    const iconStyle = { height: 20, marginRight: 5 };

    return (
      <div className="ExtraBetCard__subtitle">
        <span className="ExtraBetCard__subtitle-points" style={{ color: theme.palette.grey['500'] }}>
          <StarIcon color="inherit" style={iconStyle} />
          {points}
          &nbsp;Punkte
        </span>
        {open && (
          <span className="ExtraBetCard__subtitle-deadline" style={{ color: theme.palette.error.main }}>
            <br />
            <AlarmIcon color="inherit" style={iconStyle} />
            Noch&nbsp;
            {remainingTime}
          </span>
        )}
      </div>
    );
  }

  render() {
    const {
      hasChanges,
      isSaving,
      loadingError,
      savingError,
      savingSuccess,
      userBet,
    } = this.state;
    const {
      choices,
      name,
      open,
      points,
      result,
    } = this.props;

    const userResultBet = userBet ? userBet.result_bet : '';
    const isUserBetCorrect = result && userResultBet === result;
    const resultInfo = result ? (
      <div className={`ExtraBetCard__result-info ExtraBetCard__result-info--finished ${isUserBetCorrect ? 'volltreffer' : ''}`}>
        Ergebnis:&nbsp;
        {result}
        &nbsp;–&nbsp;
        <b>{isUserBetCorrect ? `${points} Punkte!` : 'Keine Punkte.'}</b>
      </div>)
      : <div className="ExtraBetCard__result-info">Noch kein Ergebnis.</div>;

    return (
      <Card className="ExtraBetCard" style={{ textAlign: 'left' }}>
        <CardHeader title={name} subheader={this.createSubtitleDiv()} />
        <CardContent style={{ padding: 0 }}>
          {(!loadingError && !open) && (
            <div className="ExtraBetCard__bet-info">
              Dein Tipp:&nbsp;
              <span className="ExtraBetCard__bet-info-bet">
                {(userBet && userBet.result_bet) ? userBet.result_bet : '---'}
              </span>
            </div>
          )}

          {!open && resultInfo}

          {loadingError && <div className="ExtraBetCard__loading-error">Fehler beim Laden.</div>}
        </CardContent>

        {(!loadingError && open) && (
          <BetsStatusContext.Consumer>
            {betsStatusContext => (
              <CardActions
                className="ExtraBetCard__actions"
                style={{ padding: '0 20px 10px' }}
              >
                <FormControl style={{ minWidth: 200 }}>
                  <InputLabel htmlFor="extra-bet-select">Dein Tipp</InputLabel>
                  <Select
                    value={userResultBet}
                    onChange={e => this.handleChange(e.target.value, betsStatusContext)}
                    input={<Input name="extra-bet-select" id="extra-bet-select" />}
                    style={{ marginBottom: '20px' }}
                    inputProps={{ id: 'extra-bet-select' }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                  >
                    <MenuItem value="" />
                    {choices
                      .map(choice => <MenuItem key={choice} value={choice}>{choice}</MenuItem>)}
                  </Select>
                </FormControl>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleSave(betsStatusContext)}
                    disabled={isSaving || !hasChanges}
                    style={{ margin: '0 15px' }}
                  >
                    Speichern
                  </Button>
                </div>
              </CardActions>
            )}
          </BetsStatusContext.Consumer>
        )}

        <div>
          {savingSuccess && (
            <Notification
              type={NotificationType.SUCCESS}
              title="Gespeichert!"
              disappearAfterMs={3000}
            />
          )}
          {savingError && (
            <Notification
              type={NotificationType.ERROR}
              title="Fehler beim Speichern"
              subtitle="Bitte versuche es später erneut."
            />
          )}
        </div>
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

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme()(ExtraBetCard);
