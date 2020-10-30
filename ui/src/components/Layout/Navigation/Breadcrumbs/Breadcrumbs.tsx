import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { useGetSiteQuery } from '_/hooks';

import { NavLink, LinkProps } from 'react-router-dom';

import { Link, Breadcrumbs } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


interface BreadcrumbLinkProps {
  to: string;
  exact?: boolean
  className?: string;
  children?: JSX.Element | string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: '2rem',
  },
  breadcrumb: {
    color: theme.palette.breadcrumb.main,
    fontWeight: 300,
    fontSize: '28px',
    '&.active': {
      color: theme.palette.breadcrumb.dark,
      textDecorationLine: 'underline',
    }
  },
}));

const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = (props) => {
  const { to, exact = false, children } = props;
  const classes = useStyles();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <NavLink exact={exact} to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <Link
      className={classes.breadcrumb}
      component={renderLink}
    >
      {children}
    </Link>
  )
};

interface Props {
  params: {
    [key: string]: string;
  }
}

const FloatBreadcrumbs: React.FC<Props> = ({ params }) => {
  const classes = useStyles();
  const { siteSlug = "", flockSlug = "", pageSlug = "" } = params;
  const [, currentSite] = useGetSiteQuery(siteSlug);

  const { name = '', pages = [], flocks = []}: { name: string, pages: Page[], flocks: Flock[] } = currentSite || {};

  return (
    <Breadcrumbs className={classes.root} separator={<ArrowRightIcon fontSize="small" />} aria-label="breadcrumb">
      <BreadcrumbLink
        to="/site"
        exact
      >
        Projects
      </BreadcrumbLink>
      {currentSite && (
        <BreadcrumbLink
          to={`/site/${siteSlug}`}
          exact
        >
            {name}
        </BreadcrumbLink>
      )}
      {(pageSlug && currentSite) && (
        <BreadcrumbLink
          exact
          to={`/site/${siteSlug}/page/${pageSlug}/edit`}
        >
          {pages.find(page => page.slug === pageSlug)?.name || ''}
        </BreadcrumbLink>
      )}
      {flockSlug && (
        <BreadcrumbLink
          exact
          to={`/site/${siteSlug}/flock/${flockSlug}/edit`}
        >
          {flocks.find(flock => flock.slug === flockSlug)?.name || ''}
        </BreadcrumbLink>
      )}
    </Breadcrumbs>
  );
};

export default FloatBreadcrumbs;
