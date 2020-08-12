import React from 'react';
import { render } from 'react-dom';

import ReactGA from 'react-ga';
import { BrowserRouter as Router } from 'react-router-dom';

import { ApolloClient, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

import { cache } from '_/apollo/cache';
import { resolvers, typeDefs } from '_/apollo/resolvers';

import Layout from '_/components/Layout/Layout';

import '../assets/styles/main.less';

if (ENVS.TRACKING_ID) {
  ReactGA.initialize(ENVS.TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const link = createUploadLink({ uri: ENVS.API_URL });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(link),
  typeDefs,
  resolvers,
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
