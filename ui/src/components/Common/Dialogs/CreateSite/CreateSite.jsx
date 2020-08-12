import React from 'react';

import PropTypes from 'prop-types';

import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { CreateSite } from '_/apollo/mutations';

import { useErrorState } from '_/hooks';

import Input from '_/components/Common/Input/Input';
import ErrorList from '_/components/Common/ErrorList/ErrorList';

const initialState = {
  name: '',
  slug: '',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'name':
      return { ...state, name: payload };
    case 'slug':
      return { ...state, slug: payload };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
};

const CreateSiteDialog = ({ open, handleClose }) => {
  const history = useHistory();
  const [errors, handleError, onError] = useErrorState([]);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    control, errors: formErrors, reset, handleSubmit,
  } = useForm();
  const [createSite] = useMutation(CreateSite, {
    onCompleted() {
      history.push(`/site/${state.slug}`);
      handleClose();
    },
    onError,
  });

  const handleReset = () => {
    handleClose();
    handleError({ type: 'reset' });
    dispatch({ type: 'reset' });
    reset(initialState);
  };

  const onSubmit = (data) => {
    handleError({ type: 'reset' });
    createSite({ variables: { site: data } });
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="form-dialog-title">Create New Site</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a site name and a unique slug for the site.
          </DialogContentText>
          <Input
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!formErrors.name || !!errors.length}
            field={{
              name: 'name',
              label: 'Site Name',
              onChange: (value) => dispatch({ type: 'name', payload: value }),
            }}
            message={formErrors.name?.message}
            value={state.name}
            control={control}
            rules={{ required: 'Site name is required' }}
          />
          <Input
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!formErrors.slug || !!errors.length}
            field={{
              name: 'slug',
              label: 'Site Slug',
              onChange: (value) => dispatch({ type: 'slug', payload: value }),
            }}
            message={formErrors.slug?.message}
            value={state.slug}
            control={control}
            rules={{ required: 'Site slug is required' }}
            inputProps={{
              maxLength: 15,
            }}
          />
          <ErrorList errors={errors} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleReset}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

CreateSiteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateSiteDialog;
