import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/client';
import { useErrorState } from '_/hooks';

import {
  Fab, Grid, Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import { GetSites } from '_/apollo/queries.graphql';
import { CreateSite } from '_/apollo/mutations.graphql';


import Loading from '_/components/Common/Loading/Loading';
import SiteCard from '_/components/Common/SiteCard/SiteCard';
import FormDialog from '_/components/Common/FormDialog/FormDialog';

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
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const onError = useErrorState([])[2];
  const [createSite] = useMutation(CreateSite, {
    onCompleted({ createSite }) {
      history.push(`/site/${createSite.site.slug}`);
      setOpen(false);
    },
    onError,
  });

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
      <FormDialog
        open={open}
        handleClose={() => setOpen(false)}
        title="Create New Site"
        content="Choose a site name and a unique slug for the site."
        submitData={(data: Record<string, string>) => {
          createSite({ variables: { site: data } });
        }}
        fields={[
          {
            name: 'name',
            label: 'Site Name',
            rules: { required: 'Site name is required '},
            inputProps: {
              maxLength: 15,
            },
          },
          {
            name: 'slug',
            label: 'Site Slug',
            rules: { required: 'Site slug is required '},
            inputProps: {
              maxLength: 15,
            },
          },
        ]}
      />
      <Grid container spacing={2} className={classes.root}>
        <Typography variant="h2">
          Your Sites
        </Typography>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {sites.map((site: Site) => (
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
