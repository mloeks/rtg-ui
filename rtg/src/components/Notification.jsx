import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader } from 'material-ui';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Close from 'material-ui/svg-icons/navigation/close';
import Error from 'material-ui/svg-icons/alert/error';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { lightenDarkenColor } from '../service/ColorHelper';

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

// TODO P3 animated show/hide
class Notification extends Component {
  static getIconByType(type, color) {
    const iconStyle = { width: '30px', height: '30px' };
    if (type === NotificationType.SUCCESS) {
      return <CheckCircle color={color} style={iconStyle} />;
    }
    return <Error color={color} style={iconStyle} />;
  }

  constructor(props) {
    super(props);
    this.state = { visible: true };
    this.disappearTimeoutHandler = null;
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    if (this.props.disappearAfterMs) {
      this.disappearTimeoutHandler = setTimeout(this.handleClose, this.props.disappearAfterMs);
    }
  }

  componentWillUnmount() {
    clearInterval(this.disappearTimeoutHandler);
  }

  handleClose() {
    this.setState({ visible: false });
    this.props.onClose();
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    const notificationColor = this.props.muiTheme.palette[`${this.props.type}Color`];

    return (
      <Card
        className={this.props.className}
        style={{
          backgroundColor: lightenDarkenColor(notificationColor, 150),
          ...this.props.containerStyle
        }}
      >
        <CardHeader
          closeIcon={<Close onClick={this.handleClose} />}
          title={this.props.title}
          showExpandableButton={this.props.dismissable}
          subtitle={this.props.subtitle}
          subtitleStyle={{ fontWeight: 400 }}
          style={{
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            lineHeight: '1.4',
            ...this.props.style,
          }}
          textStyle={{ paddingRight: this.props.dismissable ? '23px' : '0' }}
          avatar={Notification.getIconByType(this.props.type, notificationColor)}
        />
      </Card>
    );
  }
}

Notification.defaultProps = {
  disappearAfterMs: null,
  dismissable: false,
  subtitle: null,
  onClose: () => {},
  className: null,
  style: {},
  containerStyle: {},
};

Notification.propTypes = {
  disappearAfterMs: PropTypes.number,
  dismissable: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,

  onClose: PropTypes.func,

  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  containerStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default muiThemeable()(Notification);
