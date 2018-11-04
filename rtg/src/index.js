/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';

import '@babel/polyfill';
import 'react-app-polyfill/ie11';
import 'blob-polyfill';
import 'canvas-toBlob';

import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import App from './App';
import './service/closest-polyfill';

import './index.scss';

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>,
  document.getElementById('root'), // eslint-disable-line no-undef
);
