import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { NavLink, LinkProps } from 'react-router-dom';

import { Link } from '@material-ui/core';

interface BreadcrumbLinkProps {
  to: string;
  exact?: boolean
  className?: string;
  children?: JSX.Element | string;
}

const useStyles = makeStyles((theme: Theme) => ({
  breadcrumb: {
    color: theme.palette.breadcrumb.main,
    fontWeight: 300,
    fontSize: '28px',
    '&.active': {
      color: theme.palette.breadcrumb.dark,
      textDecorationLine: 'underline',
    }
  },
}));

const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = (props) => {
  const { to, exact = false, children } = props;
  const classes = useStyles();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <NavLink exact={exact} to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <Link
      className={classes.breadcrumb}
      component={renderLink}
    >
      {children}
    </Link>
  )
};

export default BreadcrumbLink;
