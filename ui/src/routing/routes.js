import Home from '_/components/Home/Home';
import Login from '_/components/Login/Login';
import Signup from '_/components/Signup/Signup';

export default [
  {
    name: 'home', path: '/', exact: true, component: Home, loginRequired: true,
  },
  {
    name: 'login', path: '/login', exact: true, component: Login,
  },
  {
    name: 'signup', path: '/signup', exact: true, component: Signup,
  },
];
