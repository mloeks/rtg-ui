import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

class VisiblePasswordField extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  handleIconClick() {
    this.setState(prevState => ({ visible: !prevState.visible }));
  }

  render() {
    const { visible } = this.state;
    const iconProps = {
      color: 'primary',
      onClick: this.handleIconClick,
      style: {
        position: 'absolute',
        top: 21,
        right: 5,
      },
    };

    return (
      <div style={{ position: 'relative' }}>
        <TextField
          type={visible ? 'text' : 'password'}
          inputProps={{ style: { paddingRight: '40px' } }}
          {...this.props}
        />
        {visible
          ? <VisibilityOffIcon {...iconProps} />
          : <VisibilityIcon {...iconProps} />}
      </div>
    );
  }
}

export default VisiblePasswordField;
