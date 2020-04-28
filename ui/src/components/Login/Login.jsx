import React from 'react';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { useForm, Controller } from 'react-hook-form';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { GetToken, Login } from '_/apollo/mutations';
import IsUserLoggedIn from '_/apollo/queries';

import Copyright from '_/components/Common/Copyright/Copyright';


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
  const history = useHistory();
  const { data: { isLoggedIn } } = useQuery(IsUserLoggedIn);
  const { control, errors, handleSubmit } = useForm();
  const [login] = useMutation(Login, {
    onCompleted() {
      history.push('/');
    },
  });
  const [tokenAuth] = useMutation(GetToken, {
    onCompleted({ tokenAuth: { token } }) {
      login({ variables: { token } });
    },
  });

  const [usernameValue, setUsername] = React.useState('');
  const [passwordValue, setPassword] = React.useState('');
  const classes = useStyles();

  const onSubmit = ({ username, password }) => {
    tokenAuth({ variables: { username, password } });
  };

  React.useEffect(() => {
    if (isLoggedIn) history.push('/');
  }, [history, isLoggedIn]);

  return (
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
          <Controller
            name="username"
            as={TextField}
            control={control}
            defaultValue={usernameValue}
            onChange={([value]) => {
              setUsername(value);
              return value;
            }}
            error={!!errors.username}
            helperText={errors.username?.message}
            rules={{ required: 'Username is required' }}
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
            autoFocus
          />
          <Controller
            name="password"
            as={TextField}
            control={control}
            onChange={([value]) => {
              setPassword(value);
              return value;
            }}
            rules={{ required: 'Password is required' }}
            error={!!errors.password}
            helperText={errors.password?.message}
            defaultValue={passwordValue}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
          />
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
  );
};
