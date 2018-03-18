import React from 'react';
import PropTypes from 'prop-types';

import './BigPicture.css';

const BigPicture = props => (
  <section
    className="BigPicture"
    style={{ backgroundImage: `url(${props.img})` }}
  >
    {props.children}
  </section>
);

BigPicture.propTypes = {
  children: PropTypes.node,
  img: PropTypes.string.isRequired,
};

BigPicture.defaultProps = {
  children: null,
};

export default BigPicture;
