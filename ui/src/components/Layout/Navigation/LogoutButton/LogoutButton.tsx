import React from 'react';

import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import { isLoggedInVar } from '_/apollo/cache';

const LogoutButton = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    isLoggedInVar(false);
    history.push('/login');
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
