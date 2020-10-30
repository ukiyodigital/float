import React from 'react';
import { render } from 'react-dom';

import ReactGA from 'react-ga';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ApolloClient, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

import { cache } from '_/apollo/cache';

import Layout from '_/components/Layout/Layout';

declare module "@material-ui/core/styles/createPalette" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Palette {
    border: Palette['primary'];
    breadcrumb: Palette['primary'];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PaletteOptions {
    border: PaletteOptions['primary'];
    breadcrumb: PaletteOptions['primary'];
  }
}

const { REACT_APP_TRACKING_ID: TRACKING_ID, REACT_APP_API_URL: API_URL } = process.env;

if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const themeOptions = {
  palette: {
    background: {
      default: '#fff',
    },
    primary: {
      light: '#EDF6F9;',
      main: '#83C5BE',
      dark: '#006D77',
    },
    secondary: {
      light: '#FFF5F2',
      main: '#E29578',
      dark: '#965841',
    },
    border: {
      main: '#EDF6F9',
    },
    breadcrumb: {
      main: '#989898',
      dark: '#333333',
    },
  },
  typography: {
    fontFamily: 'noto-sans, sans-serif',
  },
};

const theme = createMuiTheme(themeOptions);
const link = createUploadLink({ uri: API_URL });

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
});

// app container
const appContainer = document.getElementById('app');
if (appContainer === null) {
  throw new Error('app container id "app" is not defined.');
}

// app component
const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  </ApolloProvider>
);

// renderer
const renderApp = (): void => {
  render(<App />, appContainer);
};

export default renderApp;
