import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Visibility from '@mui/icons/Visibility';
import VisibilityOff from '@mui/icons/VisibilityOff';

class VisiblePasswordField extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  handleIconClick() {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  }

  render() {
    const {
      error,
      fullWidth,
      helperText,
      label,
      name,
      onChange,
      value,
    } = this.props;
    const { visible } = this.state;

    return (
      <FormControl error={error} fullWidth={fullWidth}>
        <InputLabel>{label}</InputLabel>
        <Input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleIconClick}
                onMouseDown={(e) => { e.preventDefault(); }}
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )}
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }
}

VisiblePasswordField.propTypes = {
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,

  onChange: PropTypes.func.isRequired,
};

VisiblePasswordField.defaultProps = {
  error: false,
  fullWidth: false,
  helperText: null,
  label: 'Passwort',
  name: '',
  value: '',
};

export default VisiblePasswordField;
