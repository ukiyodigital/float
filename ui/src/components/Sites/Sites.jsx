import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

import { Grid, Typography } from '@material-ui/core';

import { GetSites } from '_/apollo/queries';

import Loading from '_/components/Common/Loading/Loading';
import SiteCard from '_/components/Common/SiteCard/SiteCard';

const useStyles = makeStyles({
  root: {
    marginTop: 25,
  },
});

const Sites = () => {
  const classes = useStyles();
  const {
    loading,
    data: {
      me = {},
      sites = [],
    } = {},
  } = useQuery(GetSites);

  return loading ? (
    <Loading loading={loading} />
  ) : (
    <Grid container spacing={2} className={classes.root}>
      <Typography variant="h2">
        {me.username}
      </Typography>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {sites.map((site) => (
            <Grid key={site.id} item>
              <SiteCard site={site} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Sites;
