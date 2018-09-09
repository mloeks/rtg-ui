import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scrollY } from 'verge';
import Button from '@material-ui/core/Button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { throttle, ThrottledScrollPositionListener } from '../service/EventsHelper';

// TODO P3 animate scrolling
class BackToTopButton extends Component {
  constructor(props) {
    super(props);
    this.state = { show: scrollY() > this.props.showFromScrollPos };
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
    this.setState({
      show: position > this.props.showFromScrollPos
    });
  }

  render() {
    return (
      <Button
        variant="fab"
        title="Nach oben"
        style={{
          position: 'fixed',
          bottom: this.state.show ? this.props.bottomOffset : -70,
          right: this.props.rightOffset,
          zIndex: 9999,
          transition: 'bottom 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
        onClick={() => { window.scrollTo(0, 0); }}
      >
        <ArrowUpwardIcon />
      </Button>
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
