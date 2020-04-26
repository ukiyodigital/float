import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import RouteNode from '_/components/RouteNode/RouteNode';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  }
}));

export default () => {
  const classes = useStyles();
  console.log(ENVS);
  return (
      <>
        <div className={classes.root}>
          <AppBar position='static'>
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color='inherit'
                aria-label='menu'
                edge='start'
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Float
              </Typography>
              <Button color='inherit'>
                <Link to="/login">
                  Login
                </Link>
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <Container>
          <RouteNode />
        </Container>
      </>
  );
};
