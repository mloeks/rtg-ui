import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stickybits from 'stickybits';

import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import DoneIcon from '@material-ui/icons/Done';

import './BetsStatusPanel.scss';

class BetsStatusPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { showSavingIndicator: false };
    this.stickybitsInstance = null;
    this.savingIndicatorTimeout = null;
  }

  componentDidMount() {
    this.stickybitsInstance = stickybits('.BetsStatusPanel', { verticalPosition: 'bottom' });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.saving) {
      this.savingIndicatorTimeout = setTimeout(() => {
        this.setState({ showSavingIndicator: true });
      }, 500);
    } else if (!nextProps.saving) {
      clearTimeout(this.savingIndicatorTimeout);
      this.setState({ showSavingIndicator: false });
    }
  }

  componentWillUnmount() {
    if (this.stickybitsInstance) {
      this.stickybitsInstance.cleanup();
    }
  }

  render() {
    const { showSavingIndicator } = this.state;
    const {
      hasChanges,
      onSave,
      saving,
      success,
      theme,
    } = this.props;

    const shouldDisplay = hasChanges || success;
    return (
      <>
        {saving && <div className="BetsStatusPanel__saving-overlay" />}
        <div className={`BetsStatusPanel ${success ? 'BetsStatusPanel--success' : ''} ${!shouldDisplay ? 'BetsStatusPanel--hidden' : ''}`}>
          {(hasChanges && !showSavingIndicator && !success) && (
            <Button
              fullWidth
              color="primary"
              disabled={saving}
              onClick={onSave}
              style={{ fontSize: 16 }}
            >
              Änderungen speichern
            </Button>
          )}

          {showSavingIndicator && (
            <LinearProgress style={{ position: 'absolute', top: 0, width: '100%' }} />
          )}
          {showSavingIndicator && <span>Speichern...</span>}

          {success && (
            <span className="BetsStatusPanel__success-info">
              <DoneIcon style={{ color: theme.palette.success.main }} />
              Änderungen gespeichert.
            </span>
          )}
        </div>
      </>
    );
  }
}

BetsStatusPanel.defaultProps = {
  hasChanges: false,
  saving: false,
  success: false,
};

BetsStatusPanel.propTypes = {
  hasChanges: PropTypes.bool,
  saving: PropTypes.bool,
  success: PropTypes.bool,
  onSave: PropTypes.func.isRequired,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(BetsStatusPanel);
