import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Typography } from '@material-ui/core';
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

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const CreateSiteForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [errors, handleError, onError] = useErrorState([]);
  const {
    control, errors: formErrors, reset, handleSubmit,
  } = useForm();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [createSite] = useMutation(CreateSite, {
    onCompleted() {
      history.push('/site');
    },
    onError,
  });

  const onReset = () => {
    handleError({ type: 'reset' });
    dispatch({ type: 'reset' });
    reset(initialState);
  };

  const onSubmit = (data) => {
    handleError({ type: 'reset' });
    createSite({ variables: { site: data } });
  };


  return (
    <Container>
      <Typography variant="h2">
        Create a new site
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
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
          error={!!formErrors.slug || !!errors.length}
          field={{
            name: 'slug',
            label: 'Slug',
            onChange: (value) => dispatch({ type: 'slug', payload: value }),
          }}
          message={formErrors.slug?.message}
          value={state.slug}
          control={control}
          rules={{ required: 'Slug is required' }}
          inputProps={{
            maxLength: 15,
          }}
        />
        <ErrorList errors={errors} />
        <div>
          <Button
            type="button"
            variant="contained"
            onClick={onReset}
            className={classes.button}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
          >
            Create
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default CreateSiteForm;
