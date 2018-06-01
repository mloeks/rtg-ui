import React from 'react';
import PropTypes from 'prop-types';

import './RtgSeparator.css';

const RtgSeparator = ({ content, contentStyle, style, ...rest }) => (
  <div className="RtgSeparator" {...rest} style={style}>
    {content && <div className="RtgSeparator__text" style={contentStyle}>{content}</div>}
  </div>
);

RtgSeparator.defaultProps = {
  content: null,
  style: {},
  contentStyle: {},
};

RtgSeparator.propTypes = {
  content: PropTypes.node,
  style: PropTypes.object,
  contentStyle: PropTypes.object,
};

export default RtgSeparator;
