import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { CreateFlock } from '_/apollo/mutations.graphql';

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

const CreateFlockDialog = ({ open, handleClose, site }) => {
  const history = useHistory();
  const [errors, handleError, onError] = useErrorState([]);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    control, errors: formErrors, reset, handleSubmit,
  } = useForm();
  const [createFlock] = useMutation(CreateFlock, {
    onCompleted() {
      history.push(`/site/${site.slug}/flock/${state.slug}/edit`);
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
    createFlock({ variables: { siteId: site.id, flock: data } });
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="form-dialog-title">Create New Flock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a name and a unique slug for the flock.
          </DialogContentText>
          <Input
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!formErrors.name || !!errors.length}
            field={{
              name: 'name',
              label: 'Flock Name',
              onChange: (value) => dispatch({ type: 'name', payload: value }),
            }}
            message={formErrors.name?.message}
            value={state.name}
            control={control}
            rules={{ required: 'Flock name is required' }}
          />
          <Input
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!formErrors.slug || !!errors.length}
            field={{
              name: 'slug',
              label: 'Flock Slug',
              onChange: (value) => dispatch({ type: 'slug', payload: value }),
            }}
            message={formErrors.slug?.message}
            value={state.slug}
            control={control}
            rules={{ required: 'Flock slug is required' }}
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

CreateFlockDialog.propTypes = {
  site: AppPropTypes.site.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateFlockDialog;
