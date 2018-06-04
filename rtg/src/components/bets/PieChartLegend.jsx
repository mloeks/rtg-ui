import React from 'react';
import PropTypes from 'prop-types';
import { darkGrey, lightGold } from '../../theme/RtgTheme';

const PieChartLegend = (props) => {
  return (
    <div className={props.className} style={props.containerStyle}>
      {props.data.map(dataEntry => (
        <div
          key={`chart-legend-entry-${dataEntry.caption}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            padding: '3px 0',
            borderBottom: `1px solid ${lightGold}`,
            color: darkGrey,
            textAlign: 'left',
            fontSize: '14px',
            ...props.entryStyle,
          }}
        >
          <span
            style={{
              marginRight: 5,
              backgroundColor: dataEntry.color,
              borderRadius: '50%',
              width: 14,
              height: 14,
              minWidth: 14,
            }}
          />
          <span
            style={{
              maxWidth: '70%',
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'left',
            }}
          >{dataEntry.caption}
          </span>
          <span style={{ minWidth: '30px', textAlign: 'right' }}>{dataEntry.value.toFixed(0)} %</span>
        </div>
      ))}
    </div>
  );
};

PieChartLegend.defaultProps = {
  className: '',
  containerStyle: {},
  entryStyle: {},
};

PieChartLegend.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    caption: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  containerStyle: PropTypes.object,
  entryStyle: PropTypes.object,
};

export default PieChartLegend;
