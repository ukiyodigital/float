import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import Layout from '_/components/Layout/Layout';

import '../assets/styles/main.less';

const client = new ApolloClient({
  uri: `${ENVS.API_URL}/graphql/`,
});

// app container
const appContainer = document.getElementById('app');
if (appContainer === null) {
  throw new Error('app container id "app" is not defined.');
}

// app component
const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Layout />
    </Router>
  </ApolloProvider>
);

// renderer
const renderApp = () => {
  render(<App />, appContainer);
};

export default renderApp;
