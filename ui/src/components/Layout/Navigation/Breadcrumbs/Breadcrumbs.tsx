import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useGetSiteQuery } from '_/hooks';

import { Breadcrumbs } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import BreadcrumbLink from '_/components/Layout/Navigation/Breadcrumbs/BreadcrumbLink/BreadcrumbLink';


interface Props {
  component?: React.FC | JSX.Element,
  params: {
    [key: string]: string;
  }
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    '& .end': {

    },
  },
  breadcrumbs: {
    marginBottom: '2rem',
    flex: 1,
  }
}));

const FloatBreadcrumbs: React.FC<Props> = ({ params, component }) => {
  const classes = useStyles();
  const { siteSlug = "", flockSlug = "", pageSlug = "" } = params;
  const [, currentSite] = useGetSiteQuery(siteSlug);

  const { name = '', pages = [], flocks = []}: { name: string, pages: Page[], flocks: Flock[] } = currentSite || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any = component;

  return (
    <div className={classes.root}>
      <Breadcrumbs className={classes.breadcrumbs} separator={<ArrowRightIcon fontSize="small" />} aria-label="breadcrumb">
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
      <div className="end">
        {component && (<Component />)}
      </div>
    </div>
  );
};

export default FloatBreadcrumbs;
