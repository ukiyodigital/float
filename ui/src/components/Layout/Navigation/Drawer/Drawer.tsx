import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import {
  Collapse, Divider, Drawer,
  List, ListItem, ListSubheader, ListItemText,
  Toolbar, Typography,
} from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Link from '_/components/Common/Link/Link';

import { GetSites } from '_/apollo/queries.graphql';
import { useQuery } from '@apollo/client';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.dark,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    '& img': {
      marginLeft: '75px',
    }
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

const AppDrawer: React.FC = () => {
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);
  const classes = useStyles();
  const {
    data: {
      sites = [],
    } = {},
  } = useQuery(GetSites);

  const toggleSite = (siteId: string) => {
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
        <Link to="/">
          <Typography
            variant="h6"
            className={classes.title}
          >
            Float
          </Typography>
        </Link>
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
        {sites.map((site: Site) => {
          const active = openMenus.includes(site.id);
          return (
            <React.Fragment key={site.id}>
              <Link to={`/site/${site.slug}`}>
                <ListItem button>
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
              </Link>
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
                  {(site?.pages || []).map((page) => (
                    <Link
                      key={page.id}
                      to={`/site/${site.slug}/page/${page.slug}/edit`}
                    >
                      <ListItem
                        button
                        className={classes.nested}
                      >
                        <ListItemText primary={page.name} />
                      </ListItem>
                    </Link>
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
                  {(site?.flocks || []).map((flock) => (
                    <Link
                      key={flock.id}
                      to={`/site/${site.slug}/flock/${flock.slug}/edit`}
                    >
                      <ListItem
                        button
                        className={classes.nested}
                      >
                        <ListItemText primary={flock.name} />
                      </ListItem>
                    </Link>
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
