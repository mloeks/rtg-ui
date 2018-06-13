import React from 'react';
import PropTypes from 'prop-types';
import { TableRowColumn } from 'material-ui';
import { grey, lightGold, lightGrey } from '../../theme/RtgTheme';
import { StateEnum } from '../GameCardGameInfo';

const ColouredResultBetColumn = (props) => {
  const isVolltreffer = props.bet && props.bet.result_bet_type === StateEnum.VOLLTREFFER;

  return (<TableRowColumn
    style={{
      ...props.style,
      backgroundColor: isVolltreffer ? lightGold : 'transparent',
      fontWeight: isVolltreffer ? 'bold' : 'normal',
      textAlign: 'center',
    }}
  >
    {props.bet ? props.bet.result_bet : '---'}
    {props.bet && props.bet.result_bet_type &&
      <sup style={{ fontWeight: 'normal', color: isVolltreffer ? grey : lightGrey }}> {props.bet.points}</sup>}
  </TableRowColumn>);
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
};

export default ColouredResultBetColumn;
