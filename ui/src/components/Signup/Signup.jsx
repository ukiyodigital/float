import React from 'react';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar, Box, Button, Container, Grid, Link, Typography,
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { IsUserLoggedIn } from '_/apollo/queries';
import { Login, Signup as CreateUser } from '_/apollo/mutations';

import { useErrorState } from '_/hooks';

import Loading from '_/components/Common/Loading/Loading';
import Copyright from '_/components/Common/Copyright/Copyright';
import ErrorList from '_/components/Common/ErrorList/ErrorList';
import Input from '_/components/Common/Input/Input';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'firstName':
      return { ...state, firstName: payload };
    case 'lastName':
      return { ...state, lastName: payload };
    case 'email':
      return { ...state, lastName: payload };
    case 'username':
      return { ...state, lastName: payload };
    case 'password':
      return { ...state, lastName: payload };
    case 'confirmPassword':
      return { ...state, lastName: payload };
    default:
      throw new Error();
  }
};

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const {
    control, errors: formErrors, handleSubmit, watch,
  } = useForm();
  const [errors, handleError, onError] = useErrorState([]);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  const [login] = useMutation(Login, {
    onCompleted() {
      history.push('/site');
    },
  });

  const [createUser, { loading }] = useMutation(CreateUser, {
    onCompleted({ createUser: { token } }) {
      login({ variables: { token } });
    },
    onError,
  });

  const onSubmit = ({ confirmPassword, ...data }) => {
    handleError({ type: 'reset' });
    createUser({ variables: { ...data } });
  };

  React.useEffect(() => {
    if (isLoggedIn) history.push('/site');
  }, [history, isLoggedIn]);

  return (
    <>
      <Loading loading={loading} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Input
              error={!!formErrors.firstName || !!errors.length}
              field={{
                name: 'firstName',
                label: 'First Name',
                onChange: (value) => dispatch({ type: 'firstName', payload: value }),
              }}
              message={formErrors.firstName?.message}
              value={state.firstName}
              control={control}
              rules={{ required: 'First Name is required' }}
              autoFocus
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Input
              error={!!formErrors.lastName || !!errors.length}
              field={{
                name: 'lastName',
                label: 'Last Name',
                onChange: (value) => dispatch({ type: 'lastName', payload: value }),
              }}
              message={formErrors.lastName?.message}
              value={state.lastName}
              control={control}
              rules={{ required: 'Last Name is required' }}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Input
              error={!!formErrors.username || !!errors.length}
              field={{
                name: 'username',
                label: 'Username',
                onChange: (value) => dispatch({ type: 'username', payload: value }),
              }}
              message={formErrors.username?.message}
              value={state.username}
              control={control}
              rules={{ required: 'Username is required' }}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Input
              error={!!formErrors.email || !!errors.length}
              field={{
                name: 'email',
                label: 'Email',
                onChange: (value) => dispatch({ type: 'email', payload: value }),
              }}
              message={formErrors.email?.message}
              value={state.email}
              control={control}
              rules={{ required: 'Email is required' }}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Input
              error={!!(formErrors.password || formErrors.confirmPassword) || !!errors.length}
              field={{
                name: 'password',
                label: 'Password',
                type: 'password',
                onChange: (value) => dispatch({ type: 'password', payload: value }),
              }}
              message={formErrors.password?.message}
              value={state.password}
              control={control}
              rules={{ required: 'Password is required' }}
              autoComplete="current-password"
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Input
              error={!!(formErrors.password || formErrors.confirmPassword) || !!errors.length}
              field={{
                name: 'confirmPassword',
                label: 'Confirm Password',
                type: 'password',
                onChange: (value) => dispatch({ type: 'confirmPassword', payload: value }),
              }}
              message={formErrors.confirmPassword?.message}
              value={state.confirmPassword}
              control={control}
              rules={{
                required: 'You must confirm password',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              }}
              autoComplete="current-password"
              margin="normal"
              fullWidth
            />
            <ErrorList errors={errors} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  Have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
};
