import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardHeader } from 'material-ui';
import Done from 'material-ui/svg-icons/action/done';
import Close from 'material-ui/svg-icons/navigation/close';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { lightenDarkenColor } from '../service/ColorHelper';

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

// TODO P3 animated show/hide
class Notification extends Component {
  static getIconByType(type) {
    if (type === NotificationType.SUCCESS) {
      return <Done />;
    }
    return <Close />;
  };

  constructor(props) {
    super(props);
    this.state = { visible: true };
    this.disappearTimeoutHandler = null;
  }

  componentDidMount() {
    if (this.props.disappearAfterMs) {
      this.disappearTimeoutHandler = setTimeout(() => {
        this.setState({ visible: false });
      }, this.props.disappearAfterMs);
    }
  }

  componentWillUnmount() {
    clearInterval(this.disappearTimeoutHandler);
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    const notificationColor = this.props.muiTheme.palette[`${this.props.type}Color`];

    return (
      <Card
        className={this.props.className}
        style={{ ...this.props.style, backgroundColor: lightenDarkenColor(notificationColor, 150) }}
      >
        <CardHeader
          title={this.props.title}
          subtitle={this.props.subtitle}
          subtitleStyle={{ fontWeight: 400 }}
          style={{
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            lineHeight: '1.4',
          }}
          textStyle={{ paddingRight: 0 }}
          avatar={
            <Avatar
              icon={Notification.getIconByType(this.props.type)}
              color="#FFFFFF"
              backgroundColor={lightenDarkenColor(notificationColor, 0)}
              size={30}
            />
          }
        />
      </Card>
    );
  }
}

Notification.defaultProps = {
  disappearAfterMs: null,
  subtitle: null,
  className: null,
  style: {},
};

Notification.propTypes = {
  disappearAfterMs: PropTypes.number,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,

  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  muiTheme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default muiThemeable()(Notification);
