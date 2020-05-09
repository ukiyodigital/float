import Login from '_/components/Login/Login';
import Signup from '_/components/Signup/Signup';

import SiteList from '_/components/SiteList/SiteList';
import SiteDetail from '_/components/SiteDetail/SiteDetail';
import CreateSite from '_/components/CreateSite/CreateSite';

export default [
  {
    name: 'sites', path: '/', exact: true, component: SiteList, loginRequired: true,
  },
  {
    name: 'create-site', path: '/create', exact: true, component: CreateSite, loginRequired: true,
  },
  {
    name: 'site-detail', path: '/:siteSlug', exact: true, component: SiteDetail, loginRequired: true,
  },
  {
    name: 'login', path: '/login', exact: true, component: Login,
  },
  {
    name: 'signup', path: '/signup', exact: true, component: Signup,
  },
];
