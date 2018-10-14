import React from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import { StateEnum } from '../GameCardGameInfo';

const ColouredResultBetColumn = (props) => {
  const isVolltreffer = props.bet && props.bet.result_bet_type === StateEnum.VOLLTREFFER;

  return (
    <TableCell
      style={{
        ...props.style,
        backgroundColor: isVolltreffer ? props.theme.palette.secondary.light : 'transparent',
        fontWeight: isVolltreffer ? 'bold' : 'normal',
        textAlign: 'center',
      }}
    >
      {props.bet ? props.bet.result_bet : '---'}
      {props.bet && props.bet.result_bet_type && (
        <sup
          style={{
            fontWeight: 'normal',
            color: isVolltreffer ? props.theme.palette.grey['500'] : props.theme.palette.grey['300'],
          }}
        >
          &nbsp;{props.bet.points}
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
  }),
  style: PropTypes.object,

  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTheme()(ColouredResultBetColumn);
