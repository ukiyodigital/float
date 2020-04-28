import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { resolvers, typeDefs } from '_/apollo/resolvers';

import Layout from '_/components/Layout/Layout';

import '../assets/styles/main.less';

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  uri: ENVS.API_URL,
  request: (operation) => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `JWT ${token}` : '',
      },
    });
  },
  typeDefs,
  resolvers,
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
  },
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
