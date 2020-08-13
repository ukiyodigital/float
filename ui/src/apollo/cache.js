import { InMemoryCache, makeVar } from '@apollo/client';

export const isLoggedInVar = makeVar(!!localStorage.getItem('token'));
export const currentSiteVar = makeVar(null);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
        currentSite: {
          read() {
            return currentSiteVar();
          },
        },
      },
    },
  },
});

export default {
  cache,
  isLoggedInVar,
};
