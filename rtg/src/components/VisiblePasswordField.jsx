import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { lightGrey, purple } from '../theme/RtgTheme';

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
    const iconProps = {
      color: lightGrey,
      hoverColor: purple,
      onClick: this.handleIconClick,
      style: {
        position: 'absolute',
        top: '37px',
        right: '5px',
      },
    };

    return (
      <div style={{ position: 'relative' }}>
        <TextField
          type={this.state.visible ? 'text' : 'password'}
          inputStyle={{ paddingRight: '40px' }}
          {...this.props}
        />
        {this.state.visible ?
          <VisibilityOffIcon {...iconProps} /> :
          <VisibilityIcon {...iconProps} />}
      </div>
    );
  }
}

export default VisiblePasswordField;
