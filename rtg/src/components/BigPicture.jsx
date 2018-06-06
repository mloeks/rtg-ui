import React, { Component } from 'react';
import { inViewport } from 'verge';
import PropTypes from 'prop-types';
import { ThrottledEventListener, ThrottledScrollPositionListener } from '../service/EventsHelper';

import './BigPicture.css';

class BigPicture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showImg: !this.props.lazyLoadWhenInViewport,
    };

    this.ref = React.createRef();
    if (this.props.lazyLoadWhenInViewport) {
      this.scrollListener = new ThrottledScrollPositionListener();
      this.resizeListener = new ThrottledEventListener('resize');
    }
    this.displayIfLazyLoadAndInView = this.displayIfLazyLoadAndInView.bind(this);
  }

  componentDidMount() {
    if (this.props.lazyLoadWhenInViewport) {
      this.displayIfLazyLoadAndInView();

      this.scrollListener.addCallback(this.displayIfLazyLoadAndInView);
      this.resizeListener.addCallback(this.displayIfLazyLoadAndInView);
    }
  }

  componentWillUnmount() {
    if (this.scrollListener) this.scrollListener.removeAll();
    if (this.resizeListener) this.resizeListener.removeAll();
  }

  displayIfLazyLoadAndInView() {
    if (this.props.lazyLoadWhenInViewport && inViewport(this.ref.current, 50)) {
      this.setState({ showImg: true });
    }
  }

  render() {
    const style = this.state.showImg ? {
      backgroundImage: `url(${this.props.img})`,
      backgroundPositionY: `${this.props.positionY}%`,
    } : {};

    return (
      <section ref={this.ref} className={`BigPicture ${!this.state.showImg ? 'BigPicture--skeleton' : ''}`} style={style}>
        {this.props.children}
      </section>
    );
  }
}

BigPicture.defaultProps = {
  children: null,
  lazyLoadWhenInViewport: false,
  positionY: 50,
};

BigPicture.propTypes = {
  children: PropTypes.node,
  img: PropTypes.string.isRequired,
  lazyLoadWhenInViewport: PropTypes.bool,
  positionY: PropTypes.number,
};

export default BigPicture;
