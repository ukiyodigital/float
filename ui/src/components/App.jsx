import React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';

import { BrowserRouter as Router } from 'react-router-dom';

import Layout from '_/components/Layout/Layout';

import '../assets/styles/main.less';


// app container
const appContainer = document.getElementById('app');
if (appContainer === null) {
  throw new Error('app container id "app" is not defined.');
}

// app component
const App = () => (
  <Router>
    <Layout />
  </Router>
);

const HotApp = hot(module)(App);

// renderer
const renderApp = () => {
  render(<HotApp />, appContainer);
};

export default renderApp;
