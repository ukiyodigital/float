import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { Link, LinkProps } from 'react-router-dom';
import {
  Collapse, Drawer,
  List, ListItem, ListSubheader, ListItemText,
  Toolbar,
  ListItemIcon,
} from '@material-ui/core';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { useGetSiteQuery } from '_/hooks';

import icon from "_/assets/images/float-logo-blue-transparent.png";

const drawerWidth = 260;

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.dark,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    justifyContent: 'center',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.drawer.light,
  },
  subheader: {
    marginTop: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.3em',
    fontSize: '14px',
    fontWeight: 300,
    lineHeight: '19px',
    color: theme.palette.drawer.main,
  },
  list: {
    marginLeft: '2.5rem',
  },
  listItem: {
    cursor: 'pointer',
    fontWeight: 300,
    fontSize: '14px',
    color: theme.palette.drawer.main,
  },
  listIcon: {
    minWidth: '32px',
    color: theme.palette.drawer.main,
  },
  nested: {
    width: 'auto',
    color: theme.palette.drawer.main,
    marginLeft: theme.spacing(6),
    paddingLeft: theme.spacing(3),
    position: 'relative',
    '&:not(:last-of-type):not(:first-of-type)': {
      borderLeft: `2px solid ${theme.palette.drawer.main}`,
    },
    '&:first-of-type:after': {
      content: '""',
      position: 'absolute',
      top: '35%',
      bottom: 0,
      left: 0,
      borderLeft: `2px solid ${theme.palette.drawer.main}`,
    },
    '&:last-of-type:after': {
      content: '""',
      position: 'absolute',
      bottom: '35%',
      top: 0,
      left: 0,
      borderLeft: `2px solid ${theme.palette.drawer.main}`,
    }
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

interface Props {
  params: {
    [key: string]: string;
  }
}

const AppDrawer: React.FC<Props> = ({ params }) => {
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);
  const classes = useStyles();
  const { siteSlug = "" } = params;
  const [, currentSite] = useGetSiteQuery(siteSlug);

  const toggleSite = (type: string) => {
    const idx = openMenus.findIndex((menuType) => menuType === type);
    if (idx === -1) {
      setOpenMenus([...openMenus, type]);
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
        className={classes.list}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={(
          <ListSubheader
            className={classes.subheader}
            component="div"
            id="nested-list-subheader"
          >
            {currentSite && currentSite.name}
          </ListSubheader>
        )}
      >
        {/* Pages */}
        <ListItem
          className={classes.listItem}
          onClick={(e) => {
            e.preventDefault();
            toggleSite("pages");
          }}
        >
          <ListItemIcon className={classes.listIcon}>
            {!openMenus.includes('pages') ? (
              <ArrowRightIcon />
            ) : (
              <ArrowDropDownIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Pages" />
        </ListItem>

        <Collapse in={openMenus.includes('pages')} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
          >
            {(currentSite?.pages || []).map((page) => (
              <ListItemLink
                key={page.id}
                to={`/site/${currentSite?.slug}/page/${page.slug}/edit`}
                className={classes.nested}
              >
                <ListItemText primary={page.name} />
              </ListItemLink>
            ))}
          </List>
        </Collapse>

        {/* Flocks */}
        <ListItem
          className={classes.listItem}
          onClick={(e) => {
            e.preventDefault();
            toggleSite("flocks");
          }}
        >
          <ListItemIcon className={classes.listIcon}>
            {!openMenus.includes('flocks') ? (
              <ArrowRightIcon />
            ) : (
              <ArrowDropDownIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Flocks" />
        </ListItem>

        <Collapse in={openMenus.includes('flocks')} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
          >
            {(currentSite?.flocks || []).map((flock) => (
              <ListItemLink
                key={flock.id}
                to={`/site/${currentSite?.slug}/flock/${flock.slug}/edit`}
                className={classes.nested}
              >
                <ListItemText primary={flock.name} />
              </ListItemLink>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default AppDrawer;
