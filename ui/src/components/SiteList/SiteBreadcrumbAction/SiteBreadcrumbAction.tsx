import React, { useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '_/hooks';


import { CreateSite } from '_/apollo/mutations.graphql';

import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import FormDialog from '_/components/Common/FormDialog/FormDialog';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    color: theme.palette.primary.dark,
    marginRight: '1rem',
  },
  button: {
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.dark,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    }
  }
}));


const SiteBreadcrumbAction: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const onError = useErrorState([])[2];
  const [open, setOpen] = useState(false);
  const [createSite] = useMutation(CreateSite, {
    onCompleted({ createSite }) {
      history.push(`/site/${createSite.site.slug}`);
      setOpen(false);
    },
    onError,
  });

  return (
    <div className={classes.root}>
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
      <SearchIcon className={classes.searchIcon} color="primary" />
      <Button
        className={classes.button}
        onClick={() => setOpen(true)}
        variant="contained"
        color="primary"
      >
        Create New Site
      </Button>
    </div>
  );
};

export default SiteBreadcrumbAction;
