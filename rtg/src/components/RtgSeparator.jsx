import React from 'react';
import PropTypes from 'prop-types';

import './RtgSeparator.css';

const RtgSeparator = ({ content, style, ...rest }) => (
  <div className="RtgSeparator" {...rest} style={style}>
    {content && <div className="RtgSeparator__text">{content}</div>}
  </div>
);

RtgSeparator.defaultProps = {
  content: null,
  style: {},
};

RtgSeparator.propTypes = {
  content: PropTypes.node,
  style: PropTypes.object,
};

export default RtgSeparator;
