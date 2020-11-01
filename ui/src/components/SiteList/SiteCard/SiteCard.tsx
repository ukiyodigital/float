import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box, Typography,
} from '@material-ui/core';

import { Link, LinkProps } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '0 20px',
    width: 200,
    height: 100,
    display: 'block',
    borderTop: `4px solid ${theme.palette.primary.main}`,
    fontFamily: theme.typography.fontFamily,
    '& span': {
      display: 'block',
      fontWeight: 400,
      fontSize: '16px',
    },
    '&:hover': {
      transition: '0.25s all',
      borderTop: `4px solid ${theme.palette.primary.dark}`,
      '&:hover span': {
        fontWeight: 500,
      }
    },
  },
  title: {
    marginTop: '1rem',
    color: theme.palette.breadcrumb.dark,
  },
  slug: {
    color: theme.palette.breadcrumb.light,
  },
}));

interface Props {
  site: Site;
}

const SiteCard: React.FC<Props> = ({ site }) => {
  const classes = useStyles();

  const to = `/site/${site.slug}`;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <Link to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <Box
      component={renderLink}
      className={classes.root}
    >
      <span className={classes.title}>{site.name}</span>
      <span className={classes.slug}>{site.slug}</span>
    </Box>
  );
};

export default SiteCard;
