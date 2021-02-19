import React from 'react';
import ReactDOM from 'react-dom';

import 'react-app-polyfill/stable';

import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import App from './App';
import './service/closest-polyfill';

import './index.scss';

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>,
  document.getElementById('root'),
);
