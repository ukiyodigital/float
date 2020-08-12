import { InMemoryCache, makeVar } from '@apollo/client';

export const isLoggedIn = makeVar(!!localStorage.getItem('token'));

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedIn();
          },
        },
      },
    },
  },
});

export default {
  cache,
  isLoggedIn,
};
