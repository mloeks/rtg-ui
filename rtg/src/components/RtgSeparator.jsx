import React from 'react';
import PropTypes from 'prop-types';

import './RtgSeparator.css';

const RtgSeparator = props => (
  <div className="RtgSeparator">
    {props.content && <div className="RtgSeparator__text">{props.content}</div>}
  </div>
);

RtgSeparator.defaultProps = {
  content: null,
};

RtgSeparator.propTypes = {
  content: PropTypes.node,
};

export default RtgSeparator;
