import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scrollY } from 'verge';
import { FloatingActionButton } from 'material-ui';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import { globalThrottledScrollListener, throttle } from '../service/EventsHelper';

// TODO P3 animate scrolling
class BackToTopButton extends Component {
  constructor(props) {
    super(props);
    this.state = { show: scrollY() > this.props.showFromScrollPos };
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  componentDidMount() {
    globalThrottledScrollListener.addCallback(throttle(this.handleVisibility, 500));
  }

  componentWillUnmount() {
    globalThrottledScrollListener.removeAll();
  }

  handleVisibility(position) {
    this.setState({ show: position > this.props.showFromScrollPos });
  }

  render() {
    return (
      <FloatingActionButton
        title="Nach oben"
        style={{
          position: 'fixed',
          bottom: this.state.show ? this.props.bottomOffset : -70,
          right: this.props.rightOffset,
          zIndex: 9999,
          transition: 'bottom 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
        onClick={() => { window.scrollTo(0, 0); }}
      ><NavigationArrowUpward />
      </FloatingActionButton>
    );
  }
}

BackToTopButton.defaultProps = {
  bottomOffset: 24,
  rightOffset: 24,
  showFromScrollPos: 200,
};

BackToTopButton.propTypes = {
  bottomOffset: PropTypes.number,
  rightOffset: PropTypes.number,
  showFromScrollPos: PropTypes.number,
};

export default BackToTopButton;
