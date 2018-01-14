import React from 'react';
import PropTypes from 'prop-types';

import './BigPicture.css';

const BigPicture = props => (
  <section
    className="BigPicture"
    style={{
      backgroundImage: `url(${props.img})`,
      height: props.height,
    }}
  >
    {props.children}
  </section>
);

BigPicture.propTypes = {
  children: PropTypes.node,
  height: PropTypes.number,
  img: PropTypes.string.isRequired,
};

BigPicture.defaultProps = {
  children: null,
  height: 400,
};

export default BigPicture;
