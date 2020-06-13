import React from 'react';

import { useQuery } from '@apollo/react-hooks';

import { Switch, Route, Redirect } from 'react-router-dom';

import { routes, defaultPath } from '_/routing/routes';

import { IsUserLoggedIn } from '_/apollo/queries';


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
      <Route
        exact
        path="/"
      >
        <Redirect to={defaultPath} />
      </Route>
    </Switch>
  );
};

export default RouteNode;
