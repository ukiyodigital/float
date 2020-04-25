import * as React from 'react';
import { Route } from 'react-router-dom';
import routes from '../../routing/routes';

const RouteNode = () => (
  <>
    {routes.map(
      (route) => (
        <Route
          key={route.name}
          path={route.path}
          exact={route.exact}
          component={route.component}
          name={route.name}
        />
      ),
    )}
  </>
);

export default RouteNode;
