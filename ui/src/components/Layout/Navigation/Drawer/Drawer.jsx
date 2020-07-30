import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Collapse, Divider, Drawer,
  List, ListItem, ListSubheader, ListItemText,
  Toolbar, Typography,
} from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Link from '_/components/Common/Link/Link';

import { GetSitesDrawer } from '_/apollo/queries';
import { useQuery } from '@apollo/react-hooks';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow: theme.shadows[4],
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  title: {
    color: 'inherit',
    textDecoration: 'inherit',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const AppDrawer = () => {
  const [openMenus, setOpenMenus] = React.useState([]);
  const classes = useStyles();
  const {
    data: {
      sites = [],
    } = {},
  } = useQuery(GetSitesDrawer);

  const toggleSite = (siteId) => {
    const idx = openMenus.findIndex((sId) => sId === siteId);
    if (idx === -1) {
      setOpenMenus([...openMenus, siteId]);
      return;
    }
    setOpenMenus([...openMenus.slice(0, idx), ...openMenus.slice(idx + 1)]);
  };

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant="permanent"
      open
    >
      <Toolbar className={classes.toolbar}>
        <Typography
          variant="h6"
          className={classes.title}
          component={Link}
          to="/"
        >
          Float
        </Typography>
      </Toolbar>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={(
          <ListSubheader component="div" id="nested-list-subheader">
            Sites
          </ListSubheader>
        )}
      >
        {sites.map((site) => {
          const active = openMenus.includes(site.id);
          return (
            <React.Fragment key={site.id}>
              <ListItem
                button
                component={Link}
                to={`/site/${site.slug}`}
              >
                <ListItemText primary={site.name} />
                {!active ? (
                  <ExpandLess
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSite(site.id);
                    }}
                  />
                ) : (
                  <ExpandMore
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSite(site.id);
                    }}
                  />
                )}
              </ListItem>
              <Collapse in={active} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  subheader={(
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      className={classes.nested}
                    >
                      Pages
                    </ListSubheader>
                  )}
                >
                  {site.pages.map((page) => (
                    <ListItem
                      key={page.id}
                      button
                      className={classes.nested}
                      component={Link}
                      to={`/site/${site.slug}/page/${page.slug}/edit`}
                    >
                      <ListItemText primary={page.name} />
                    </ListItem>
                  ))}
                  <Divider />
                </List>
                <List
                  component="div"
                  disablePadding
                  subheader={(
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      className={classes.nested}
                    >
                      Flocks
                    </ListSubheader>
                  )}
                >
                  {site.flocks.map((flock) => (
                    <ListItem
                      key={flock.id}
                      button
                      className={classes.nested}
                      component={Link}
                      to={`/site/${site.slug}/flock/${flock.slug}/edit`}
                    >
                      <ListItemText primary={flock.name} />
                    </ListItem>
                  ))}
                  <Divider />
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
