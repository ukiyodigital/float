import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardActions, CardHeader, Typography,
} from '@material-ui/core';

import Link from '_/components/Common/Link/Link';

import AppPropTypes from '_/proptypes';

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'grid',
    padding: '0 20px',
    width: 200,
    height: 200,
    '&:hover': {
      backgroundColor: 'black',
      color: theme.color,
      transition: '0.25s all',
    },
  },
  title: ({ hover }) => ({
    color: hover ? 'white' : 'inherit',
    transition: '0.25s all',
  }),
  subheader: ({ hover }) => ({
    color: hover ? 'white' : 'inherit',
    transition: '0.25s all',
  }),
  owner: ({ hover }) => ({
    color: hover ? 'white' : 'inherit',
    transition: '0.25s all',
    display: 'flex',
    justifyContent: 'space-betwween',
  }),
}));

const SiteCard = ({ site }) => {
  const [hover, setHover] = React.useState(false);
  const classes = useStyles({ hover });

  return (
    <Card
      component={Link}
      to={`/${site.slug}`}
      className={classes.root}
      onMouseOver={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onBlur={() => setHover(false)}
    >
      <CardHeader
        title={site.name}
        titleTypographyProps={{
          className: classes.title,
        }}
        subheaderTypographyProps={{
          className: classes.subheader,
        }}
        subheader={site.slug}
      />

      <CardActions className={classes.owner}>
        <Typography variant="button" display="block">
          {site.owner?.username}
        </Typography>
      </CardActions>
    </Card>
  );
};

SiteCard.propTypes = {
  site: AppPropTypes.site.isRequired,
};

export default SiteCard;
