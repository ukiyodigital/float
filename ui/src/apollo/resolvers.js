import { gql } from 'apollo-boost';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const resolvers = {
  Mutation: {
    logoutUser: (_root, variables, { cache }) => {
      localStorage.removeItem('token');
      const data = { isLoggedIn: false };
      cache.writeData({ data });
      return null;
    },
    loginUser: (_root, variables, { cache }) => {
      localStorage.setItem('token', variables.token);
      const data = { isLoggedIn: true };
      cache.writeData({ data });
      return null;
    },
  },
};
