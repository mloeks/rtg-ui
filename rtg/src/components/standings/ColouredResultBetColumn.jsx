import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import { withTheme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import { StateEnum } from '../GameCardGameInfo';

const ColouredResultBetColumn = ({ bet, style, theme }) => {
  const isVolltreffer = bet && bet.result_bet_type === StateEnum.VOLLTREFFER;

  return (
    <TableCell
      style={{
        ...style,
        backgroundColor: isVolltreffer ? theme.palette.secondary.light : 'transparent',
        fontWeight: isVolltreffer ? 'bold' : 'normal',
        textAlign: 'center',
      }}
    >
      {bet ? bet.result_bet : '---'}
      {bet && bet.result_bet_type && (
        <sup
          style={{
            fontWeight: 'normal',
            color: isVolltreffer ? theme.palette.grey['500'] : theme.palette.grey['300'],
          }}
        >
          &nbsp;
          {bet.points}
        </sup>
      )}
    </TableCell>
  );
};

ColouredResultBetColumn.defaultProps = {
  bet: null,
  style: null,
};

ColouredResultBetColumn.propTypes = {
  bet: PropTypes.shape({
    result_bet: PropTypes.string,
    result_bet_type: PropTypes.string,
    points: PropTypes.number,
  }),
  style: stylePropType,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme(ColouredResultBetColumn);
