import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typography, Paper } from '@material-ui/core';

import LayersIcon from '@material-ui/icons/Layers';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    padding: '2rem 0',
    display: 'flex',
    minHeight: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(237, 246, 249, 0.5)',
    color: theme.palette.primary.dark,
    boxShadow: 'none',
  },
  title: {
    marginTop: -20,
    fontSize: '72px',
  },
  layersIcon: {
    marginBottom: '2rem',
  },
}));

interface Props {
  name: string,
  number: number,
}

const NumberCard: React.FC<Props> = ({ name, number }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div>
        <LayersIcon className={classes.layersIcon} />
      </div>
      <Typography variant="h2" className={classes.title}>
        {number}
      </Typography>
      <Typography variant="h5">
        {name}
      </Typography>
    </Paper>
  );
};

export default NumberCard
