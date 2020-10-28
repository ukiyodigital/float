import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';
import { NavLink, LinkProps } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  exact?: boolean
  className?: string;
  children?: JSX.Element | string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '&:hover:after, &.active:after': {
      content: '""',
      display: 'block',
      border: '8px solid transparent',
      borderBottomColor: `${theme.palette.primary.dark}`,
      position: 'absolute',
      bottom: 0,
      margin: 'auto',
    }
  }
}));

const FloatNavLink: React.FC<NavLinkProps> = (props) => {
  const { to, exact = false, className, children } = props;
  const classes = useStyles();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <NavLink exact={exact} to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <Button
      color="inherit"
      component={renderLink}
      className={`${className} ${classes.root}`}
    >
      {children}
    </Button>
  )
};

export default FloatNavLink;
