import React from 'react';

import { useQuery } from '@apollo/client';
import { makeStyles, Theme } from '@material-ui/core/styles';

import {
  AppBar, Button, Toolbar, Typography,
} from '@material-ui/core';

import Link from '_/components/Common/Link/Link';
import LogoutButton from '_/components/Layout/Navigation/LogoutButton/LogoutButton';

import { IsUserLoggedIn } from '_/apollo/queries.graphql';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  hide: {
    visibility: 'hidden',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
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
    <AppBar position="fixed" className={hasSidebar ? classes.appBar : ''}>
      <Toolbar>
        <Link to="/">
          <Typography
            variant="h6"
            className={classes.title}
          >
            Float
          </Typography>
        </Link>
        {
          isLoggedIn ? (
            <LogoutButton />
          ) : (
            <>
              <Link to="/login">
                <Button color="inherit">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button color="inherit">
                  Signup
                </Button>
              </Link>
            </>
          )
        }
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
