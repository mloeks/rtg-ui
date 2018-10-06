import hsl from 'hsl-to-hex';
// Sometimes helpful template:
// https://v1-5-0.material-ui.com/customization/default-theme/

/* eslint-disable no-unused-vars */
// Keep in sync with _colors.scss
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

export const betResultNiete = hsl(18, 85, 40);
export const betResultTendenz = hsl(45, 85, 40);
export const betResultRemisTendenz = hsl(65, 85, 40);
export const betResultDifferenz = hsl(180, 85, 40);
export const betResultVolltreffer = hsl(138, 85, 40);
/* eslint-enable no-unused-vars */

export default {
  typography: {
    fontFamily: 'Roboto, sans-serif',
    headline: {
      fontFamily: 'Lobster Two, cursive',
      fontWeight: 'normal',
      fontSize: 32,
      fontStyle: 'normal',
    },
    title: {
      fontFamily: 'Lobster Two, cursive',
      fontWeight: 'normal',
      fontSize: 24,
      fontStyle: 'normal',
    },
  },
  palette: {
    common: {
      black,
      white,
    },
    primary: {
      main: purple,
      contrastText: white,
    },
    secondary: {
      light: lightGold,
      main: gold,
      dark: darkGold,
      contrastText: black,
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161',
    },
    error: {
      main: error,
    },
    success: {
      main: success,
    },
    text: {
      primary: black,
      secondary: lightGrey,
    },
    background: {
      paper: '#fff',
      default: white,
    },
    errorColor: error,
    successColor: success,
    footerColor: darkGrey,
    footerSocialIconColor: lightGrey,
    scheduleToolbarColor: darkGrey,
  },
  shape: {
    borderRadius: 2,
  },
  overrides: {
    MuiAppBar: {
      colorSecondary: {
        backgroundColor: white,
      },
    },
  },
};
