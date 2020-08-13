import React from 'react';
import { useQuery } from '@apollo/client';
import { GetSite } from '_/apollo/queries';
import { currentSiteVar } from '_/apollo/cache';

const initialState = { errors: [] };

const reducer = (state, { type, payload: { errors, errorType } = {} }) => {
  switch (type) {
    case 'setErrors':
      return { ...state, errors: errors.map((message, i) => ({ key: i, message, errorType })) };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
};

export const useErrorState = (errs) => {
  const [{ errors }, dispatch] = React.useReducer(reducer, { errors: errs });

  const onError = ({ graphQLErrors: g, networkError: n }) => {
    if (g) {
      dispatch({ type: 'setErrors', payload: { errors: g.map(({ message }) => message), errorType: 'graphQLErrors' } });
    }
    if (n) dispatch({ type: 'networkError', payload: { errors: ['A network error occurred, please try again.'], errorType: 'networkError' } });
  };

  return [errors, dispatch, onError];
};

export const useGetSiteQuery = (slug) => {
  const { loading, data: { site } = {} } = useQuery(GetSite, {
    variables: { slug },
  });

  React.useEffect(() => {
    currentSiteVar(site);
    return function cleanup() {
      currentSiteVar(null);
    };
  }, [site]);

  return [loading, site];
};

export default {
  useGetSiteQuery,
  useErrorState,
};
