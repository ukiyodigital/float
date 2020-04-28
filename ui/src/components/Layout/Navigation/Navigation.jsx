import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import MenuIcon from '@material-ui/icons/Menu';

import LogoutButton from '_/components/Layout/Navigation/LogoutButton/LogoutButton';

import IsUserLoggedIn from '_/apollo/queries';

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
  const history = useHistory();
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);
  const classes = useStyles();

  const preventDefault = (event) => event.preventDefault();

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
                <Button color="inherit">
                  <Link
                    color="inherit"
                    href="/login"
                    onClick={(e) => {
                      preventDefault(e);
                      history.push('/login');
                    }}
                  >
                    Login
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link
                    color="inherit"
                    href="/signup"
                    onClick={(e) => {
                      preventDefault(e);
                      history.push('/signup');
                    }}
                  >
                    Signup
                  </Link>
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
