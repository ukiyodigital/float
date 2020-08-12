import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';

import {
  Button, Container, Divider, Grid, IconButton, Typography, Paper,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import { GetSite } from '_/apollo/queries';

import Loading from '_/components/Common/Loading/Loading';
import CreatePageDialog from '_/components/Common/Dialogs/CreatePage/CreatePage';
import CreateFlockDialog from '_/components/Common/Dialogs/CreateFlock/CreateFlock';

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
  const [open, setOpen] = React.useState(false);
  const [flockDialog, setFlockDialog] = React.useState(false);
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
      <CreatePageDialog
        site={site}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <CreateFlockDialog
        site={site}
        open={flockDialog}
        handleClose={() => setFlockDialog(false)}
      />
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
              <Grid container spacing={2}>
                {site.pages.map((page) => (
                  <Grid key={page.id} item xs={12}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={1}>
                        <Grid item xs={11}>
                          <Typography>{page.name}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            color="inherit"
                            component={Link}
                            to={`/site/${site.slug}/page/${page.slug}/edit`}
                          >
                            <EditIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                  >
                    <AddIcon />
                    New Page
                  </Button>
                </Grid>
              </Grid>
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
                  Flocks
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {site.flocks.map((flock) => (
                  <Grid key={flock.id} item xs={12}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={1}>
                        <Grid item xs={11}>
                          <Typography>{flock.name}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            color="action"
                            component={Link}
                            to={`/site/${site.slug}/flock/${flock.slug}/edit`}
                          >
                            <EditIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    color="primary"
                    component={Link}
                    fullWidth
                    variant="contained"
                    onClick={() => setFlockDialog(true)}
                  >
                    <AddIcon />
                    New Flock
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SiteDetail;
