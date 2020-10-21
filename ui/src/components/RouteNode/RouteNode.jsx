import React from 'react';

import { useQuery } from '@apollo/client';

import { Switch, Route, Redirect } from 'react-router-dom';

import { routes } from '_/routing/routes';

import { IsUserLoggedIn } from '_/apollo/queries.graphql';

const RouteNode = () => {
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  return (
    <Switch>
      {routes.map(
        (route) => (
          route.loginRequired ? (
            <Route
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...route}
              component={null}
              key={route.name}
              render={({ location }) => {
                const Component = route.component;
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
              component={route.component}
              name={route.name}
            />
          )
        ),
      )}
    </Switch>
  );
};

export default RouteNode;
