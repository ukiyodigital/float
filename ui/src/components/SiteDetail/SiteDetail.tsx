import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { useGetSiteQuery, useErrorState } from '_/hooks';

import { CreatePage, CreateFlock } from '_/apollo/mutations.graphql';

import {
  Button, Container, Divider, Grid,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import Loading from '_/components/Common/Loading/Loading';
import FormDialog from '_/components/Common/FormDialog/FormDialog';
import NumberCard from '_/components/SiteDetail/NumberCard/NumberCard';
import Row from '_/components/SiteDetail/Row/Row';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    margin: '25px auto',
  },
  row: {
    borderBottom: '1px solid #EDF6F9',
  },
  button: {
    color: theme.palette.primary.dark,
  }
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
              <NumberCard
                name="Pages"
                number={site.pages.length}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {site?.pages?.map((page: Page) => (
                  <Grid
                    item xs={12}
                    key={page.id}
                    className={classes.row}
                  >
                    <Row
                      type="page"
                      name={page.name}
                      slug={page.slug}
                      siteSlug={site.slug}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    className={classes.button}
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
              <NumberCard
                name="Flocks"
                number={site?.flocks?.length}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {site?.flocks?.map((flock: Flock) => (
                  <Grid
                    key={flock.id}
                    item
                    xs={12}
                    className={classes.row}
                  >
                    <Row
                      type="flock"
                      name={flock.name}
                      slug={flock.slug}
                      siteSlug={site.slug}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    className={classes.button}
                    color="primary"
                    fullWidth
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
