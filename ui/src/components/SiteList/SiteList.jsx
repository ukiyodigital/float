import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

import {
  Fab, Grid, Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { GetSites } from '_/apollo/queries';

import Loading from '_/components/Common/Loading/Loading';
import SiteCard from '_/components/Common/SiteCard/SiteCard';
import CreateSiteDialog from '_/components/Common/Dialogs/CreateSite/CreateSite';

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

const SiteList = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const {
    refetch,
    loading,
    data: {
      sites = [],
    } = {},
  } = useQuery(GetSites);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return loading ? (
    <Loading loading />
  ) : (
    <>
      <CreateSiteDialog
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Grid container spacing={2} className={classes.root}>
        <Typography variant="h2">
          Sites
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
      <Fab
        color="primary"
        variant="extended"
        className={classes.fab}
        onClick={() => setOpen(true)}
      >
        <Add />
        Create New Site
      </Fab>
    </>
  );
};

export default SiteList;
