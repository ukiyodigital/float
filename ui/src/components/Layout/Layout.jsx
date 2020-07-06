import React from 'react';

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

const sidebarPaths = routes.filter((route) => route.sidebar).map((route) => route.path);
const nonSidebarPaths = routes.filter((route) => !route.sidebar).map((route) => route.path);

export default () => {
  const classes = useStyles();

  return (
    <Box component="div" className={classes.root}>
      <div className={classes.flex}>
        <Switch>
          <Route path={sidebarPaths}>
            <>
              <TopNav hasSidebar />
              <AppDrawer />
              <Container className={classes.sidebarContainer}>
                <div className={classes.toolbar} />
                <RouteNode />
              </Container>
            </>
          </Route>
          <Route
            path={nonSidebarPaths}
          >
            <>
              <TopNav />
              <Container className={classes.container}>
                <div className={classes.toolbar} />
                <RouteNode />
              </Container>
            </>
          </Route>
          {/* Catch All for redirecting bad routes */}
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
