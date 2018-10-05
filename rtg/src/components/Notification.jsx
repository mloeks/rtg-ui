import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import { lightenDarkenColor } from '../service/ColorHelper';

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const styles = theme => ({
  root: {
    boxShadow: 'rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px',
  },
  icon: {
    marginRight: 0,
    width: 30,
    height: 30,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.palette.grey['600'],
  },
});

// TODO P3 closing by button click does not work in IE
// TODO P3 animated show/hide
class Notification extends Component {
  static getIconByType(type, color) {
    if (type === NotificationType.SUCCESS) {
      return <CheckCircleIcon style={{ color }} />;
    }
    return <ErrorIcon style={{ color }} />;
  }

  constructor(props) {
    super(props);
    this.state = { visible: true };
    this.disappearTimeoutHandler = null;
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { disappearAfterMs } = this.props;
    if (disappearAfterMs) {
      this.disappearTimeoutHandler = setTimeout(this.handleClose, disappearAfterMs);
    }
  }

  componentWillUnmount() {
    clearInterval(this.disappearTimeoutHandler);
  }

  handleClose() {
    const { onClose } = this.props;
    this.setState({ visible: false });
    onClose();
  }

  render() {
    const { visible } = this.state;
    const {
      classes,
      className,
      containerStyle,
      dismissable,
      subtitle,
      theme,
      title,
      type,
    } = this.props;

    if (!visible) { return null; }

    const notificationColor = type === NotificationType.SUCCESS
      ? theme.palette.success.main : theme.palette.error.main;

    return (
      <ListItem
        className={className}
        classes={{ root: classes.root }}
        component="div"
        style={{
          backgroundColor: lightenDarkenColor(notificationColor, 150),
          ...containerStyle,
        }}
      >
        <ListItemIcon classes={{ root: classes.icon }}>
          {Notification.getIconByType(type, notificationColor)}
        </ListItemIcon>
        <ListItemText
          classes={{ secondary: classes.subtitle }}
          primary={title}
          secondary={subtitle}
        />
        {dismissable && (
          <IconButton onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
        )}
      </ListItem>
    );
  }
}

Notification.defaultProps = {
  disappearAfterMs: null,
  dismissable: false,
  subtitle: null,
  onClose: () => {},
  className: null,
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

  /* eslint-disable react/forbid-prop-types */
  containerStyle: PropTypes.object,
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default withStyles(styles)(withTheme()(Notification));
