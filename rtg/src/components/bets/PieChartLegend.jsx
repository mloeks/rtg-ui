import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { withTheme } from '@mui/material/styles';

const PieChartLegend = ({
  className, containerStyle, data, entryRowHeight, entryStyle, theme,
}) => {
  const rowPadding = 3;
  return (
    <div className={className} style={containerStyle}>
      {data.map((dataEntry) => (
        <div
          key={`chart-legend-entry-${dataEntry.caption}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            height: entryRowHeight - (2 * rowPadding) - 1,
            alignItems: 'center',
            padding: `${rowPadding}px 0`,
            borderBottom: `1px solid ${theme.palette.secondary.light}`,
            color: theme.palette.grey['700'],
            textAlign: 'left',
            fontSize: '14px',
            ...entryStyle,
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
          >
            {dataEntry.caption}
          </span>
          <span style={{ minWidth: '30px', textAlign: 'right' }}>
            {`${dataEntry.value.toFixed(0)} %`}
          </span>
        </div>
      ))}
    </div>
  );
};

PieChartLegend.defaultProps = {
  className: '',
  entryRowHeight: 25,
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
  entryRowHeight: PropTypes.number,

  containerStyle: stylePropType,
  entryStyle: stylePropType,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(PieChartLegend);
