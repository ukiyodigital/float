import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';

import Navigation from '_/components/Layout/Navigation/Navigation';
import RouteNode from '_/components/RouteNode/RouteNode';


const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  container: {
    marginTop: 25,
    height: 'calc(100% - (25px + 64px))',
    position: 'relative',
  },
});

export default () => {
  const classes = useStyles();

  return (
    <Box component="div" className={classes.root}>
      <Navigation />
      <Container className={classes.container}>
        <RouteNode />
      </Container>
    </Box>
  );
};
