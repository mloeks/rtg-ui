/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';
import 'whatwg-fetch';
import 'blob-polyfill';
import 'canvas-toBlob';

import { BrowserRouter } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ScrollToTop from './components/ScrollToTop';
import App from './App';

import './index.css';

injectTapEventPlugin();

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>
  , document.getElementById('root'), // eslint-disable-line no-undef
);
