import { useEffect, useReducer } from "react";
import { ApolloError, useQuery } from "@apollo/client";
import { GetSite } from "_/apollo/queries.graphql";
import { currentSiteVar } from "_/apollo/cache";

type ActionType = "setErrors" | "reset";
type ErrorType = "graphQLErrors" | "networkError";

interface ErrorState {
  errors: FloatError[];
}

interface ErrorAction {
  type: ActionType;
  payload?:
    | {
        errors: string[];
        errorType: ErrorType;
      }
    | Record<string, unknown>;
}

const initialState = { errors: [] };

const reducer = (
  state: ErrorState,
  { type, payload: { errors = [], errorType } = {} }: ErrorAction
) => {
  switch (type) {
    case "setErrors":
      return {
        ...state,
        errors: (errors as string[]).map((message: string, i: number) => ({
          key: i,
          message,
          errorType,
        })) as FloatError[],
      };
    case "reset":
      return initialState;
    default:
      throw new Error();
  }
};

export const useErrorState = (
  errs: FloatError[]
): [
  FloatError[],
  React.Dispatch<ErrorAction>,
  (error: ApolloError) => void
] => {
  const [{ errors }, dispatch] = useReducer(reducer, { errors: errs });

  const onError = (error: ApolloError) => {
    if (error.graphQLErrors) {
      dispatch({
        type: "setErrors",
        payload: {
          errors: error.graphQLErrors.map(({ message }) => message),
          errorType: "graphQLErrors",
        },
      });
    }
    if (error.networkError)
      dispatch({
        type: "setErrors",
        payload: {
          errors: ["A network error occurred, please try again."],
          errorType: "networkError",
        },
      } as ErrorAction);
  };

  return [errors, dispatch, onError];
};

export const useGetSiteQuery = (slug: string): [boolean, Site, () => void] => {
  const { loading, data: { site } = {}, refetch } = useQuery(GetSite, {
    fetchPolicy: "no-cache",
    variables: { slug },
  });

  useEffect(() => {
    currentSiteVar(site);
    return function cleanup() {
      currentSiteVar(null);
    };
  }, [site]);

  return [loading, site, refetch];
};

export default {
  useGetSiteQuery,
  useErrorState,
};
