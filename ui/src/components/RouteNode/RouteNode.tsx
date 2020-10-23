/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useQuery } from '@apollo/client';

import { Switch, Route, Redirect } from 'react-router-dom';

import { routes } from '_/routing/routes';

import { IsUserLoggedIn } from '_/apollo/queries.graphql';

const RouteNode: React.FC = () => {
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  return (
    <Switch>
      {routes.map(
        (route) => (
          route.loginRequired ? (
            <Route
              key={route.name}
              path={route.path}
              exact={route.exact}
              render={({ location }) => {
                const Component: any = route.component;
                return isLoggedIn ? (
                  <Component />
                ) : (
                  <Redirect
                    to={{
                      pathname: '/login',
                      state: { from: location },
                    }}
                  />
                );
              }}
            />
          ) : (
            <Route
              key={route.name}
              path={route.path}
              exact={route.exact}
              render={() => {
                const Component: any = route.component;
                return <Component />
              }}
              name={route.name}
            />
          )
        ),
      )}
    </Switch>
  );
};

export default RouteNode;
