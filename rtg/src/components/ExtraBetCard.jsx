import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { MenuItem, RaisedButton, SelectField } from 'material-ui';
import { distanceInWordsToNow } from 'date-fns';
import de from 'date-fns/locale/de';

import './ExtraBetCard.css';

export default class ExtraBetCard extends Component {
  static getRemainingTime(deadline) {
    return distanceInWordsToNow(deadline);
  }

  constructor(props) {
    super(props);
    this.state = {
      // TODO de locale not working?
      remainingTime: ExtraBetCard.getRemainingTime(props.deadline, { locale: de }),
      value: null,
    };

    this.registerCountdown();
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  registerCountdown() {
    setInterval(() => {
      this.setState((prevState, prevProps) => (
        { remainingTime: ExtraBetCard.getRemainingTime(prevProps.deadline) }));
    }, 10000);
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  handleSave() {
    // TODO
  }

  render() {
    return (
      <Card className="ExtraBetCard">
        {/* TODO improve styling of countdown --> clock icon, red font, upper right corner of the card */}
        <CardTitle title={this.props.name} subtitle={`${this.props.points} Punkte - Noch ${this.state.remainingTime}`} />
        {!this.props.open && this.props.result &&
          <CardText>
            {this.props.result}
          </CardText>}
        <CardActions className="ExtraBetCard__actions">
          <SelectField
            floatingLabelText="Dein Tipp"
            value={this.state.value}
            onChange={this.handleChange}
            menuItemStyle={{ textAlign: 'left' }}
          >
            <MenuItem value={null} primaryText="" />
            {this.props.choices
              .map(choice => <MenuItem key={choice} value={choice} primaryText={choice} />)}
          </SelectField>
          <div><RaisedButton label="Speichern" primary onClick={this.handleSave} /></div>
        </CardActions>
      </Card>);
  }
}

ExtraBetCard.defaultProps = {
  result: null,
};

// TODO pass in user extraBet
ExtraBetCard.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.number.isRequired,
  deadline: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  points: PropTypes.number.isRequired,
  result: PropTypes.string,
};
