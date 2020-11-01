import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.primary.dark,
  },
}));

const SettingsAction: React.FC = () => {
  const classes = useStyles();

  return (
    <SettingsIcon className={classes.root} />
  );
};

export default SettingsAction;
