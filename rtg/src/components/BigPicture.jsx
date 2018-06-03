import React from 'react';
import PropTypes from 'prop-types';

import './BigPicture.css';

const BigPicture = (props) => {
  const style = props.img ? {
    backgroundImage: `url(${props.img})`,
    backgroundPositionY: `${props.positionY}%`,
  } : {};

  return (
    <section className={`BigPicture ${!props.img ? 'BigPicture--skeleton' : ''}`} style={style} >
      {props.children}
    </section>
  );
};

BigPicture.propTypes = {
  children: PropTypes.node,
  img: PropTypes.string,
  positionY: PropTypes.number,
};

BigPicture.defaultProps = {
  children: null,
  img: null,
  positionY: 50,
};

export default BigPicture;
