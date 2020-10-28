import React from 'react';

import { useQuery } from '@apollo/client';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useGetSiteQuery } from '_/hooks';

import { Link } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';


import LogoutButton from '_/components/Layout/Navigation/LogoutButton/LogoutButton';
import FloatNavLink from '_/components/Layout/Navigation/FloatNavLink/FloatNavLink';

import { IsUserLoggedIn } from '_/apollo/queries.graphql';

import icon from "_/assets/images/float-logo-blue-transparent.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.dark,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    alignItems: 'stretch',
  },
  logo: {
    flex: 0,
    flexBasis: '240px',
    textAlign: 'center',
    marginLeft: '-24px',
    marginRight: '24px',
  },
  hide: {
    visibility: 'hidden',
  },
  breadcrumb: {
    flex: 1,
    '& a': {
      height: '100%',
      position: 'relative',
    },
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
  params: {
    [key: string]: string;
  }
}

const TopNav: React.FC<Props> = ({ params, hasSidebar = false }) => {
  const classes = useStyles({ hasSidebar });
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);
  const { siteSlug = "", flockSlug = "", pageSlug = "" } = params;
  const [, currentSite] = useGetSiteQuery(siteSlug);

  const { name = '', pages = [], flocks = []}: { name: string, pages: Page[], flocks: Flock[] } = currentSite || {};

  console.log(currentSite);

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
            <>
              <div className={classes.breadcrumb}>
                <FloatNavLink
                  exact
                  to="/site"
                >
                  Home
                </FloatNavLink>
                {currentSite && (
                  <FloatNavLink
                    exact
                    to={`/site/${siteSlug}`}
                  >
                    {name}
                  </FloatNavLink>
                )}
                {(pageSlug && currentSite) && (
                  <FloatNavLink
                    exact
                    to={`/site/${siteSlug}/page/${pageSlug}/edit`}
                  >
                    {`Edit ${pages.find(page => page.slug === pageSlug)?.name || ''}`}
                  </FloatNavLink>
                )}
                {flockSlug && (
                  <FloatNavLink
                    exact
                    to={`/site/${siteSlug}/flock/${flockSlug}/edit`}
                  >
                    {`Edit ${flocks.find(flock => flock.slug === flockSlug)?.name || ''}`}
                  </FloatNavLink>
                )}
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <div className={classes.breadcrumb} />
              <FloatNavLink
                exact
                to="/login"
              >
                Login
              </FloatNavLink>
              <FloatNavLink
                exact
                to="/signup"
              >
                Signup
              </FloatNavLink>
            </>
          )
        }
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
