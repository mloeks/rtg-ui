import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import { VALID_GOAL_INPUT_REGEX } from '../../service/ResultStringHelper';

import './GoalInput.scss';

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
      goals,
      id,
      editing,
      onBlur,
    } = this.props;
    return (
      <TextField
        className={`GoalInput__text-field${editing ? ' editing' : ''}`}
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
        InputProps={{ disableUnderline: true }}
      />
    );
  }
}

GoalInput.propTypes = {
  editing: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  goals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default GoalInput;
