import gql from 'graphql-tag';
import { isLoggedIn } from '_/apollo/cache';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const resolvers = {
  Mutation: {
    logoutUser: () => {
      localStorage.removeItem('token');
      isLoggedIn(false);
      return null;
    },
    loginUser: (_root, variables) => {
      localStorage.setItem('token', variables.token);
      isLoggedIn(true);
      return null;
    },
  },
};
