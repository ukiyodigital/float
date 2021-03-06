import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';

import { Link, useHistory } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box, Button, Container, Grid, Typography,
} from '@material-ui/core';

import CssBaseline from '@material-ui/core/CssBaseline';

import { GetToken } from '_/apollo/mutations.graphql';
import { IsUserLoggedIn } from '_/apollo/queries.graphql';
import { isLoggedInVar } from '_/apollo/cache';

import { useErrorState } from '_/hooks';

import Loading from '_/components/Common/Loading/Loading';
import Copyright from '_/components/Common/Copyright/Copyright';
import ErrorList from '_/components/Common/ErrorList/ErrorList';
import Input from '_/components/Common/Input/Input';

import floatLogo from '_/assets/images/float-logo.png';

const useStyles = makeStyles((theme: Theme) => ({
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

const Login: React.FC = () => {
  const history = useHistory();
  const [errors, dispatch, onError] = useErrorState([]);
  const { control, errors: formErrors, handleSubmit } = useForm();
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);

  const [tokenAuth, { loading }] = useMutation(GetToken, {
    onCompleted({ tokenAuth: { token } }) {
      localStorage.setItem('token', token);
      isLoggedInVar(true);
    },
    onError,
  });

  const onSubmit = ({ username, password }: { username: string, password: string }) => {
    dispatch({ type: 'reset' });
    tokenAuth({ variables: { username, password } });
  };

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const usernameField = {
    name: 'username',
    label: 'Username',
    onChange: (value: string) => setUsername(value),
  };
  const passwordField = {
    name: 'password',
    label: 'Password',
    type: 'password',
    onChange: (value: string) => setPassword(value),
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
          <img src={floatLogo} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            onSubmit={handleSubmit((data: { username: string, password: string }) => onSubmit(data))}
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
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Input
              error={!!formErrors.password || !!errors.length}
              field={passwordField}
              message={formErrors.password?.message}
              value={password}
              control={control}
              rules={{ required: 'Password is required' }}
              autoComplete="current-password"
              variant="outlined"
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
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup">
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

export default Login;
