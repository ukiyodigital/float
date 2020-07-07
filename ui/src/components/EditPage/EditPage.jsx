import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  Grid,
  Paper,
  TextField,
} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { GetSite } from '_/apollo/queries';

import AddIcon from '@material-ui/icons/Add';
import TitleIcon from '@material-ui/icons/Title';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles(() => ({
  item: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    marginTop: '12px',
  },
  input: {
    marginBottom: '5px',
  },
  addButton: {
    marginTop: '15px',
  },
}));

const EditPage = () => {
  const classes = useStyles();
  const { siteSlug: slug, pageSlug = '' } = useParams();
  const {
    loading,
    data: {
      site,
    } = {},
  } = useQuery(GetSite, {
    variables: { slug },
  });

  console.log(site);

  // can be used for either editing existing or creating new pages
  return loading && pageSlug ? 'loading' : (
    <>
      <form>
        <Paper>
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            justify="center"
          >
            <Grid className={`${classes.item} ${classes.icon}`} item xs={2}>
              <TitleIcon />
            </Grid>
            <Grid className={`${classes.item} ${classes.input}`} item xs={8}>
              <TextField multiline fullWidth label="Label!" />
            </Grid>
            <Grid className={`${classes.item} ${classes.icon}`} item xs={2}>
              <SettingsIcon />
            </Grid>
          </Grid>
        </Paper>
      </form>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.addButton}
      >
        <AddIcon />
        Add Field
      </Button>
    </>
  );
};

export default EditPage;
