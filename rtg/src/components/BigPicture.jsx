import React from 'react';
import PropTypes from 'prop-types';

import './BigPicture.css';

const BigPicture = props => (
  <section
    className="BigPicture"
    style={{ backgroundImage: `url(${props.img})`, backgroundPositionY: `${props.positionY}%` }}
  >
    {props.children}
  </section>
);

BigPicture.propTypes = {
  children: PropTypes.node,
  img: PropTypes.string.isRequired,
  positionY: PropTypes.number,
};

BigPicture.defaultProps = {
  children: null,
  positionY: 50,
};

export default BigPicture;
