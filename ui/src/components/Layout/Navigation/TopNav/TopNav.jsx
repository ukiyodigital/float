import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

import {
  AppBar, Button, Toolbar, Typography,
} from '@material-ui/core';

import Link from '_/components/Common/Link/Link';
import LogoutButton from '_/components/Layout/Navigation/LogoutButton/LogoutButton';

import { IsUserLoggedIn } from '_/apollo/queries.graphql';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
    visibility: (props) => (props.hasSidebar ? 'hidden' : ''),
    color: 'inherit',
    textDecoration: 'inherit',
  },
}));

const TopNav = ({ hasSidebar }) => {
  const classes = useStyles({ hasSidebar });
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  return (
    <AppBar position="fixed" className={hasSidebar ? classes.appBar : null}>
      <Toolbar>
        <Typography
          variant="h6"
          className={classes.title}
          component={Link}
          to="/"
        >
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
  );
};

TopNav.propTypes = {
  hasSidebar: PropTypes.bool,
};

TopNav.defaultProps = {
  hasSidebar: false,
};

export default TopNav;
