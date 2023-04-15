import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { VALID_GOAL_INPUT_REGEX } from '../../service/ResultStringHelper';

const styles = {
  goalInput: {
    color: '#F2CE00',
    fontFamily: '"Oswald", sans-serif',
    fontSize: 26,
    textAlign: 'center',
  },
};

// TODO P3 add arrow key functionality for in-/decreasing the goals while in an input field
class GoalInput extends Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  validateAndNotifyChange(val) {
    const { onChange } = this.props;
    if (val.length === 0 || VALID_GOAL_INPUT_REGEX.test(val)) {
      onChange(val);
    }
  }

  render() {
    const {
      classes,
      goals,
      id,
      onBlur,
    } = this.props;

    return (
      <TextField
        className="GoalInput__text-field"
        classes={{}}
        id={id}
        inputRef={this.textInputRef}
        value={goals}
        onBlur={onBlur}
        onChange={(e) => this.validateAndNotifyChange(e.target.value)}
        onFocus={() => {
          if (this.textInputRef && this.textInputRef.current) this.textInputRef.current.select();
        }}
        style={{ width: '40%' }}
        InputProps={{
          disableUnderline: true,
          classes: { input: classes.goalInput },
        }}
      />
    );
  }
}

GoalInput.propTypes = {
  id: PropTypes.string.isRequired,
  goals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,

  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(GoalInput);
