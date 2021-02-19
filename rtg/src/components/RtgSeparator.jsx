import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import './RtgSeparator.scss';

const RtgSeparator = ({ content, contentStyle, style }) => (
  <div className="RtgSeparator" style={style}>
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
  style: stylePropType,
  contentStyle: stylePropType,
};

export default RtgSeparator;
