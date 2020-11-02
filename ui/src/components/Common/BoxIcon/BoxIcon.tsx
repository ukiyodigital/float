import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

import { IconMap, IconTypes } from '_/utils/icons';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    cursor: 'pointer',
    margin: '1rem 0',
    '& svg': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      '& $text': {
        color: theme.palette.breadcrumb.dark,
        fontWeight: 500,
      },
      '& $box': {
        backgroundColor: theme.palette.secondary.light,
      },
      '& svg': {
        color: theme.palette.secondary.main,
      },
    },
  },
  box: {
    display: 'flex',
    width: '40px',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.light,
  },
  text: {
    color: '#828282',
    marginLeft: '1rem',
    fontWeight: 300,
    fontSize: '18px',
    lineHeight: '22px',
    textTransform: 'lowercase',
  },
}));

interface Props {
  icon: IconTypes,
  name: string,
  onClick(): void,
}

const BoxIcon: React.FC<Props> = ({ icon, name, onClick }) => {
  const classes = useStyles();
  const iconComponent = IconMap[icon]

  return (
    <div
      className={classes.root}
      onClick={onClick}
    >
      <Box className={classes.box}>
        {iconComponent}
      </Box>
      <Typography className={classes.text}>{name}</Typography>
    </div>
  );
};

export default BoxIcon;
