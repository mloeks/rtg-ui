// Sometimes helpful template:
// https://github.com/mui-org/material-ui/blob/master/src/styles/getMuiTheme.js

/* eslint-disable no-unused-vars */
const black = '#372D2D';
const white = '#F9FBFA';
const grey = '#808080';
const lightGrey = '#B4B4B4';
const darkGrey = '#292929';
const purple = '#974578';
const gold = '#CD9B1D';
const darkGold = '#8B6914';
const lightGold = '#E9C467';
const success = '#58ce38';
const error = '#ce3838';
/* eslint-enable no-unused-vars */

export default {
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: purple,
    accent1Color: gold,
    accent2Color: darkGold,
    textColor: black,
    canvasColor: white,
    errorColor: error,
    footerColor: darkGrey,
    footerSocialIconColor: lightGrey,
  },
  appBar: {
    color: white,
    textColor: purple,
    avatarColor: white,
    avatarBackgroundColor: purple,
  },
};