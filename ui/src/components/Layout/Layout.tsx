import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppDrawer from '_/components/Layout/Navigation/Drawer/Drawer';
import TopNav from '_/components/Layout/Navigation/TopNav/TopNav';
import RouteNode from '_/components/RouteNode/RouteNode';

import { routes, defaultPath } from '_/routing/routes';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  flex: {
    display: 'flex',
  },
  container: {
    marginTop: 25,
    position: 'relative',
  },
  sidebarContainer: {
    marginTop: 25,
    position: 'relative',
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
}));

const Layout: React.FC = () => {
  const classes = useStyles();

  return (
    <Box component="div" className={classes.root}>
      <div className={classes.flex}>
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.name}
              path={route.path}
              exact={route.exact}
              render={({ match }) => (
                <>
                  {route.sidebar && <AppDrawer />}
                  <TopNav params={match.params} hasSidebar={route.sidebar} />
                  <Container className={classes.sidebarContainer}>
                    <div className={classes.toolbar} />
                    <RouteNode />
                  </Container>
                </>
              )}
            />
          ))}
          <Route
            exact
            path="/"
          >
            <Redirect to={defaultPath} />
          </Route>
        </Switch>
      </div>
    </Box>
  );
};

export default Layout;
