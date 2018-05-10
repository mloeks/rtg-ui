import React from 'react';
import PropTypes from 'prop-types';

import './RtgSeparator.css';

const RtgSeparator = props => (
  <div className="RtgSeparator">
    <div className="RtgSeparator__text">
      {props.content}
    </div>
  </div>
);

RtgSeparator.propTypes = {
  content: PropTypes.node.isRequired,
};

export default RtgSeparator;
