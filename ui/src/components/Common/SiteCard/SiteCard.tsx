import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Card, CardActions, CardHeader, Typography,
} from '@material-ui/core';

import Link from '_/components/Common/Link/Link';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'grid',
    padding: '0 20px',
    width: 200,
    height: 200,
    '&:hover': {
      backgroundColor: 'black',
      color: theme.palette.primary,
      transition: '0.25s all',
    },
  },
  title: ({ hover }: { hover: boolean }) => ({
    color: hover ? 'white' : 'inherit',
    transition: '0.25s all',
  }),
  subheader: ({ hover }: { hover: boolean }) => ({
    color: hover ? 'white' : 'inherit',
    transition: '0.25s all',
  }),
  owner: ({ hover }: { hover: boolean }) => ({
    color: hover ? 'white' : 'inherit',
    transition: '0.25s all',
    display: 'flex',
    justifyContent: 'space-betwween',
  }),
}));

interface Props {
  site: Site;
}

const SiteCard: React.FC<Props> = ({ site }) => {
  const [hover, setHover] = useState(false);
  const classes = useStyles({ hover });

  return (
    <Link
      to={`/site/${site.slug}`}
    >
      <Card
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
    </Link>
  );
};

export default SiteCard;
