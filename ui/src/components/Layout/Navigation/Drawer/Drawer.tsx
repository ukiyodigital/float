import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { Link, LinkProps } from 'react-router-dom';
import {
  Collapse, Divider, Drawer,
  List, ListItem, ListSubheader, ListItemText,
  Toolbar,
} from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


import { GetSites } from '_/apollo/queries.graphql';
import { useQuery } from '@apollo/client';

import icon from "_/assets/images/float-logo-blue-transparent.png";

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

interface ListItemLinkProps {
  to: string;
  className?: string;
  children?: JSX.Element;
}

const ListItemLink = (props: ListItemLinkProps) => {
  const { to, className, children } = props;
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <Link to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <ListItem
      button
      component={renderLink}
      className={className}
    >
      {children}
    </ListItem>
  )
}

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
          <img height="50" src={icon} />
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
              <ListItemLink to={`/site/${site.slug}`}>
                <>
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
                </>
              </ListItemLink>

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
                    <ListItemLink
                      key={page.id}
                      to={`/site/${site.slug}/page/${page.slug}/edit`}
                      className={classes.nested}
                    >
                      <ListItemText primary={page.name} />
                    </ListItemLink>
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
                    <ListItemLink
                      key={flock.id}
                      to={`/site/${site.slug}/flock/${flock.slug}/edit`}
                      className={classes.nested}
                    >
                      <ListItemText primary={flock.name} />
                    </ListItemLink>
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
