import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardActions, CardHeader, Typography,
} from '@material-ui/core';

import AppPropTypes from '_/proptypes';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    padding: '0 20px',
    width: 200,
    height: 200,
  },
  owner: {
    display: 'flex',
    justifyContent: 'space-betwween',
  },
});

const SiteCard = ({ site }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        title={site.name}
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
