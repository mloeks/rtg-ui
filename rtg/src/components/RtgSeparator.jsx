import React from 'react';
import PropTypes from 'prop-types';

import './RtgSeparator.css';

const RtgSeparator = ({ content, ...rest }) => (
  <div className="RtgSeparator" {...rest}>
    {content && <div className="RtgSeparator__text">{content}</div>}
  </div>
);

RtgSeparator.defaultProps = {
  content: null,
};

RtgSeparator.propTypes = {
  content: PropTypes.node,
};

export default RtgSeparator;
