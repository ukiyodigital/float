import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { useGetSiteQuery, useErrorState } from '_/hooks';

import { CreatePage, CreateFlock } from '_/apollo/mutations.graphql';

import {
  Button, Container, Divider, Grid, IconButton, Typography, Paper,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import Loading from '_/components/Common/Loading/Loading';
import FormDialog from '_/components/Common/FormDialog/FormDialog';

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

const SiteDetail: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [flockDialog, setFlockDialog] = useState(false);
  const onError = useErrorState([])[2];
  const { siteSlug: slug }: { siteSlug: string } = useParams();
  const [loading, site] = useGetSiteQuery(slug);
  const [createPage] = useMutation(CreatePage, {
    onCompleted({ createPage }) {
      history.push(`/site/${site.slug}/page/${createPage.site.slug}/edit`);
      setOpen(false);
    },
    onError,
  });
  const [createFlock] = useMutation(CreateFlock, {
    onCompleted({ createFlock }) {
      history.push(`/site/${site.slug}/flock/${createFlock.flock.slug}/edit`);
      setFlockDialog(false);
    },
    onError,
  });

  return loading ? <Loading loading /> : (
    <Container className={classes.root}>
      <FormDialog
        open={open}
        title="Create New Page"
        content="Choose a name and a unique slug for the page."
        handleClose={() => setOpen(false)}
        submitData={(data: Record<string, string>) => {
          createPage({ variables: { siteId: site.id, page: data } });
        }}
        fields={[
          {
            name: 'name',
            label: 'Page Name',
            rules: { required: 'Page name is required '},
          },
          {
            name: 'slug',
            label: 'Page Slug',
            rules: { required: 'Page slug is required '},
            inputProps: {
              maxLength: 15,
            },
          },
        ]}
      />
      <FormDialog
        open={flockDialog}
        title="Create New Flock"
        content="Choose a name and a unique slug for the flock."
        handleClose={() => setFlockDialog(false)}
        submitData={(data: Record<string, string>) => {
          createFlock({ variables: { siteId: site.id, flock: data } });
        }}
        fields={[
          {
            name: 'name',
            label: 'Flock Name',
            rules: { required: 'Flock name is required '},
          },
          {
            name: 'slug',
            label: 'Flock Slug',
            rules: { required: 'Flock slug is required '},
            inputProps: {
              maxLength: 15,
            },
          },
        ]}
      />
      <Grid>
        <Grid item xs={12} className={classes.root}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={3}>
              <Paper className={classes.numberCard}>
                <Typography variant="h2" className={classes.title}>
                  {site?.pages?.length}
                </Typography>
                <Typography variant="h5">
                  Pages
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {site?.pages?.map((page: Page) => (
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
                  {site?.flocks?.length}
                </Typography>
                <Typography variant="h5">
                  Flocks
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {site?.flocks?.map((flock: Flock) => (
                  <Grid key={flock.id} item xs={12}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={1}>
                        <Grid item xs={11}>
                          <Typography>{flock.name}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            color="inherit"
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
