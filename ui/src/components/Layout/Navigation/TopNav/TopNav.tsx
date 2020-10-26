import React from 'react';

import { useQuery } from '@apollo/client';
import { makeStyles, Theme } from '@material-ui/core/styles';

import {
  AppBar, Button, Toolbar,
} from '@material-ui/core';

import icon from "_/assets/images/float-logo-blue-transparent.png";

import { Link } from 'react-router-dom';
import LogoutButton from '_/components/Layout/Navigation/LogoutButton/LogoutButton';

import { IsUserLoggedIn } from '_/apollo/queries.graphql';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.dark,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    '& img': {
      marginLeft: '75px',
    }
  },
  logo: {
    flex: 1,
  },
  hide: {
    visibility: 'hidden',
  },
  appBar: ({ hasSidebar }) => ({
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      width: hasSidebar ? `calc(100% - ${drawerWidth}px)` : undefined,
      marginLeft: hasSidebar ? drawerWidth : undefined,
    },
  }),
  title: {
    flexGrow: 1,
    visibility: ({ hasSidebar }: { hasSidebar: boolean }) => (hasSidebar ? 'hidden' : 'inherit'),
    color: 'inherit',
    textDecoration: 'inherit',
  },
}));

interface Props {
  hasSidebar?: boolean;
}

const TopNav: React.FC<Props> = ({ hasSidebar = false }) => {
  const classes = useStyles({ hasSidebar });
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {!hasSidebar && (
          <Link className={classes.logo} to="/">
            <img height="50" src={icon} />
          </Link>
        )}

        {
          isLoggedIn ? (
            <LogoutButton />
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                color="inherit"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                color="inherit"
              >
                Signup
              </Button>
            </>
          )
        }
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
