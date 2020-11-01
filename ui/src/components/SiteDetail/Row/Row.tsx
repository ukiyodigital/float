import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { Link, LinkProps } from 'react-router-dom';
import { Box, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    boxShadow: 'none',
    textDecoration: 'none',
    display: 'block',
    color: theme.palette.breadcrumb.dark,
    '& .slug': {
      color: theme.palette.breadcrumb.light,
    },
    '&:hover': {
      '& .text': {
        color: theme.palette.primary.dark,
      }
    }
  },
}));

interface Props {
  name: string,
  slug: string,
  siteSlug: string,
  type: 'page' | 'flock',
}

const Row: React.FC<Props> = ({ name, slug, siteSlug, type }) => {
  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <Link to={`/site/${siteSlug}/${type}/${slug}/edit`} ref={ref} {...itemProps} />
      )),
    [],
  );

  return (
    <Box
      className={classes.root}
      component={renderLink}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography className="text">{name}</Typography>
          <Typography className="text">{slug}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Row;
