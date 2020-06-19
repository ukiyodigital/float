import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import {
  Container, Divider, Grid, Typography, Paper,
} from '@material-ui/core';

import { GetSite } from '_/apollo/queries';

import Loading from '_/components/Common/Loading/Loading';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginTop: -20,
  },
  paper: {
    padding: theme.spacing(2),
  },
  numberCard: {
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  divider: {
    margin: '25px auto',
  },
}));

const SiteDetail = () => {
  const classes = useStyles();
  const { siteSlug: slug } = useParams();
  const {
    loading,
    data: {
      site,
    } = {},
  } = useQuery(GetSite, {
    variables: { slug },
  });

  return loading ? <Loading loading /> : (
    <Container className={classes.root}>
      <Grid>
        <Typography variant="h2">
          {site.name}
        </Typography>
        <Grid item xs={12} className={classes.root}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={3}>
              <Paper className={classes.numberCard}>
                <Typography variant="h2" className={classes.title}>
                  {site.pages.length}
                </Typography>
                <Typography variant="h5">
                  Pages
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Paper className={classes.paper}>Test</Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={3}>
              <Paper className={classes.numberCard}>
                <Typography variant="h2" className={classes.title}>
                  {site.flocks.length}
                </Typography>
                <Typography variant="h5">
                  Collections
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Paper className={classes.paper}>Test</Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SiteDetail;
