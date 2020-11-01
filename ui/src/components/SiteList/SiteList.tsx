import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';

import { Grid } from '@material-ui/core';

import { GetSites } from '_/apollo/queries.graphql';

import Loading from '_/components/Common/Loading/Loading';
import SiteCard from '_/components/SiteList/SiteCard/SiteCard';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
}));

const SiteList: React.FC = () => {
  const classes = useStyles();

  const {
    refetch,
    loading,
    data: {
      sites = [],
    } = {},
  } = useQuery(GetSites);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return loading ? (
    <Loading loading />
  ) : (
    <>

      <Grid container spacing={2} className={classes.root}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {sites.map((site: Site) => (
              <Grid key={site.id} item md={3} xs={6}>
                <SiteCard site={site} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SiteList;
