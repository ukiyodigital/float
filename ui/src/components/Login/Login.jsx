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

import { GetToken, Login } from '_/apollo/mutations';
import { IsUserLoggedIn } from '_/apollo/queries';

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


export default () => {
  console.log('trying to run');
  const history = useHistory();
  const [errors, dispatch, onError] = useErrorState([]);
  const { control, errors: formErrors, handleSubmit } = useForm();
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  const [login] = useMutation(Login, {
    onCompleted() {
      history.push('/site');
    },
  });
  const [tokenAuth, { loading }] = useMutation(GetToken, {
    onCompleted({ tokenAuth: { token } }) {
      login({ variables: { token } });
    },
    onError,
  });

  const onSubmit = ({ username, password }) => {
    dispatch({ type: 'reset' });
    tokenAuth({ variables: { username, password } });
  };

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const usernameField = {
    name: 'username',
    label: 'Username',
    onChange: (value) => setUsername(value),
  };
  const passwordField = {
    name: 'password',
    label: 'Password',
    type: 'password',
    onChange: (value) => setPassword(value),
  };

  const classes = useStyles();

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
            Sign in
          </Typography>
          <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className={classes.form}
          >
            <Input
              error={!!formErrors.username || !!errors.length}
              field={usernameField}
              message={formErrors.username?.message}
              value={username}
              control={control}
              rules={{ required: 'Username is required' }}
              autoFocus
            />
            <Input
              error={!!formErrors.password || !!errors.length}
              field={passwordField}
              message={formErrors.password?.message}
              value={password}
              control={control}
              rules={{ required: 'Password is required' }}
              autoComplete="current-password"
            />
            <ErrorList errors={errors} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  Don&apos;t have an account? Sign Up
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
