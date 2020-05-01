import Login from '_/components/Login/Login';
import Signup from '_/components/Signup/Signup';

import Sites from '_/components/Sites/Sites';

export default [
  {
    name: 'home', path: '/', exact: true, component: Sites, loginRequired: true,
  },
  {
    name: 'login', path: '/login', exact: true, component: Login,
  },
  {
    name: 'signup', path: '/signup', exact: true, component: Signup,
  },
];
