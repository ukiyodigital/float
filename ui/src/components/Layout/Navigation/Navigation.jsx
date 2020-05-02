import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import Link from '_/components/Common/Link/Link';
import LogoutButton from '_/components/Layout/Navigation/LogoutButton/LogoutButton';

import { IsUserLoggedIn } from '_/apollo/queries';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navigation = () => {
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Float
          </Typography>
          {
            isLoggedIn ? (
              <LogoutButton />
            ) : (
              <>
                <Button
                  component={Link}
                  color="inherit"
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  color="inherit"
                  to="/signup"
                >
                  Signup
                </Button>
              </>
            )
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;
