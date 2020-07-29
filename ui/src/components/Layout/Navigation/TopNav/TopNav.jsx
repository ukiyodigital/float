import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';

import {
  AppBar, Button, Toolbar, Typography,
} from '@material-ui/core';

import Link from '_/components/Common/Link/Link';
import LogoutButton from '_/components/Layout/Navigation/LogoutButton/LogoutButton';

import { IsUserLoggedIn } from '_/apollo/queries';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const TopNav = ({ hasSidebar }) => {
  const classes = useStyles();
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  return (
    <AppBar position="fixed" className={hasSidebar ? classes.appBar : null}>
      <Toolbar>
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
  );
};

TopNav.propTypes = {
  hasSidebar: PropTypes.bool,
};

TopNav.defaultProps = {
  hasSidebar: false,
};

export default TopNav;
