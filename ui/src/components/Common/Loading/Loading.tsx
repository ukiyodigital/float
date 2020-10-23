import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
  backdrop: {
    color: '#fff',
  },
});

interface Props {
  loading: boolean;
}

const Loading: React.FC<Props> = ({ loading }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
