import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FlatButton, LinearProgress } from 'material-ui';
import Done from 'material-ui/svg-icons/action/done';
import { success } from '../../theme/RtgTheme';

import './BetsStatusPanel.css';

// TODO P2 avoid to float over footer, stick at bottom of content
class BetsStatusPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { showSavingIndicator: false };
    this.savingIndicatorTimeout = null;
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

  render() {
    return (
      <Fragment>
        {this.props.saving && <div className="BetsStatusPanel__saving-overlay" />}
        <div className={`BetsStatusPanel ${this.props.success ? ' BetsStatusPanel--success' : ''}`}>
          {(!this.state.showSavingIndicator && !this.props.success) &&
          <FlatButton
            label="Speichern"
            fullWidth
            primary
            disabled={this.props.saving}
            onClick={this.props.onSave}
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
  saving: false,
  success: false,
};

BetsStatusPanel.propTypes = {
  saving: PropTypes.bool,
  success: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
};

export default BetsStatusPanel;
