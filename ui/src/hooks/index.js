import React from 'react';

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

export default useErrorState;
