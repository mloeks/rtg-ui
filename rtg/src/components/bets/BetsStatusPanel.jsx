import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import stickybits from 'stickybits';
import { FlatButton, LinearProgress } from 'material-ui';
import Done from 'material-ui/svg-icons/action/done';
import { success } from '../../theme/RtgTheme';

import './BetsStatusPanel.css';

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

  componentWillReceiveProps(nextProps) {
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
    const shouldDisplay = this.props.hasChanges || this.props.success;
    return (
      <Fragment>
        {this.props.saving && <div className="BetsStatusPanel__saving-overlay" />}
        <div className={`BetsStatusPanel ${this.props.success ? 'BetsStatusPanel--success' : ''} ${!shouldDisplay ? 'BetsStatusPanel--hidden' : ''}`}>
          {(this.props.hasChanges && !this.state.showSavingIndicator && !this.props.success) &&
          <FlatButton
            label="Änderungen Speichern"
            fullWidth
            primary
            disabled={this.props.saving}
            onClick={this.props.onSave}
            labelStyle={{ fontSize: '16px' }}
          />}

          {this.state.showSavingIndicator &&
          <LinearProgress mode="indeterminate" style={{ position: 'absolute', top: 0 }} />}
          {this.state.showSavingIndicator && <span>Speichern...</span>}
          {this.props.success &&
            <span className="BetsStatusPanel__success-info">
              <Done color={success} />Änderungen gespeichert.
            </span>
          }
        </div>
      </Fragment>
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
};

export default BetsStatusPanel;
