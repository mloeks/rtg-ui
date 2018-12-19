import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scrollY } from 'verge';
import Fab from '@material-ui/core/Fab';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { throttle, ThrottledScrollPositionListener } from '../service/EventsHelper';

// TODO P3 animate scrolling
class BackToTopButton extends Component {
  constructor(props) {
    super(props);

    const { showFromScrollPos } = this.props;
    this.state = { show: scrollY() > showFromScrollPos };
    this.scrollHandler = null;
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  componentDidMount() {
    this.scrollHandler = new ThrottledScrollPositionListener();
    this.scrollHandler.addCallback(throttle(this.handleVisibility, 500));
  }

  componentWillUnmount() {
    if (this.scrollHandler) {
      this.scrollHandler.removeAll();
    }
  }

  handleVisibility(position) {
    const { showFromScrollPos } = this.props;
    this.setState({ show: position > showFromScrollPos });
  }

  render() {
    const { show } = this.state;
    const { bottomOffset, rightOffset } = this.props;

    return (
      <Fab
        color="primary"
        title="Nach oben"
        style={{
          position: 'fixed',
          bottom: show ? bottomOffset : -70,
          right: rightOffset,
          transition: 'bottom 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',

          // sync with _z-indexes.scss, make sure it stays below 1300 (MUI mobile dialog)
          zIndex: 1200,
        }}
        onClick={() => { window.scrollTo(0, 0); }}
      >
        <ArrowUpwardIcon />
      </Fab>
    );
  }
}

BackToTopButton.defaultProps = {
  bottomOffset: 24,
  rightOffset: 24,
  showFromScrollPos: 300,
};

BackToTopButton.propTypes = {
  bottomOffset: PropTypes.number,
  rightOffset: PropTypes.number,
  showFromScrollPos: PropTypes.number,
};

export default BackToTopButton;
