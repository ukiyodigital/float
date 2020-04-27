import React from 'react';

import { useQuery } from '@apollo/react-hooks';

import { Switch, Route, Redirect } from 'react-router-dom';

import routes from '_/routing/routes';

import IS_LOGGED_IN from '_/apollo/queries';


const RouteNode = () => {
  const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN);

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
              render={({ location }) => (
                isLoggedIn ? (
                  route.component
                ) : (
                  <Redirect
                    to={{
                      pathname: '/login',
                      state: { from: location },
                    }}
                  />
                )
              )}
            />
          ) : (
            <Route
              key={route.name}
              path={route.path}
              exact={route.exact}
              component={route.component}
              name={route.name}
            />
          )),
      )}
    </Switch>
  );
};

export default RouteNode;
