// Sometimes helpful template:
// https://github.com/mui-org/material-ui/blob/master/src/styles/getMuiTheme.js

/* eslint-disable no-unused-vars */
export const black = '#372D2D';
export const white = '#FCFCFC';
export const grey = '#808080';
export const lightGrey = '#B4B4B4';
export const darkGrey = '#292929';
export const purple = '#974578';
export const gold = '#CD9B1D';
export const darkGold = '#8B6914';
export const lightGold = '#EDD69C';
export const success = '#58ce38';
export const error = '#ce3838';
/* eslint-enable no-unused-vars */

export default {
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: purple,
    accent1Color: gold,
    accent2Color: lightGold,
    textColor: black,
    canvasColor: white,
    errorColor: error,
    successColor: success,
    footerColor: darkGrey,
    footerSocialIconColor: lightGrey,
    scheduleToolbarColor: darkGrey,
  },
  appBar: {
    color: white,
    textColor: purple,
  },
};
