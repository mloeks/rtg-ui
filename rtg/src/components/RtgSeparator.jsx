import React from 'react';
import PropTypes from 'prop-types';

import './RtgSeparator.scss';

const RtgSeparator = ({
  content, contentStyle, style, ...rest
}) => (
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

  /* eslint-disable react/forbid-prop-types */
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
};

export default RtgSeparator;
