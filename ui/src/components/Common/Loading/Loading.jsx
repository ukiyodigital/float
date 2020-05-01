import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
  backdrop: {
    color: '#fff',
  },
});

const Loading = ({ loading }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool,
};

Loading.defaultProps = {
  loading: true,
};

export default Loading;
