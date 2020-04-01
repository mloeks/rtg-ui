// See https://v1-5-0.material-ui.com/customization/default-theme/
// Keep in sync with _colors.scss

/* eslint-disable no-unused-vars */
const black = '#372D2D';
const white = '#FCFCFC';
const gold = '#CD9B1D';
const darkGold = '#8B6914';
const lightGold = '#EDD69C';
/* eslint-enable no-unused-vars */

export default {
  // keep in sync with App.scss
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 'normal',
      fontSize: 30,
      fontStyle: 'normal',
      textTransform: 'uppercase',
    },
    h2: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 'normal',
      fontSize: 28,
      fontStyle: 'normal',
      textTransform: 'uppercase',
    },
    h4: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 'normal',
      fontSize: 24,
      fontStyle: 'normal',
    },
    h5: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 'normal',
      fontSize: 22,
      fontStyle: 'normal',
    },
    h6: {
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 'normal',
      fontSize: 20,
      fontStyle: 'normal',
    },
  },
  palette: {
    common: {
      black,
      white,
    },
    primary: {
      main: '#974578',
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
      main: '#ce3838',
    },
    success: {
      main: '#58ce38',
    },
    text: {
      primary: black,
      secondary: '#B4B4B4',
    },
    background: {
      paper: '#fff',
      default: white,
    },
    custom: {
      footer: {
        main: '#292929',
        contrastText: lightGold,
      },
    },
  },
  overrides: {
    MuiAppBar: {
      colorSecondary: {
        backgroundColor: white,
      },
    },
    MuiTab: {
      textColorPrimary: {
        color: '#616161',
      },
    },
  },
};
