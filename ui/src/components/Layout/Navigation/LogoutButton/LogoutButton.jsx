import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import { Logout } from '_/apollo/mutations';

const LogoutButton = () => {
  const history = useHistory();
  const [logoutUser] = useMutation(Logout, {
    onCompleted() {
      history.push('/login');
    },
  });

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
