import Login from '_/components/Login/Login';
import Signup from '_/components/Signup/Signup';

import SiteList from '_/components/SiteList/SiteList';
import SiteDetail from '_/components/SiteDetail/SiteDetail';
import CreateSite from '_/components/CreateSite/CreateSite';
import EditPage from '_/components/EditPage/EditPage';

export const defaultPath = '/site';

export const routes = [
  {
    name: 'sites', path: '/site', exact: true, component: SiteList, loginRequired: true,
  },
  {
    name: 'create-site', path: '/site/create', exact: true, component: CreateSite, loginRequired: true,
  },
  {
    name: 'site-detail', path: '/site/:siteSlug', exact: true, component: SiteDetail, loginRequired: true,
  },
  {
    hash: 'create-page', name: 'create-page', path: '/site/:siteSlug/page', exact: true, component: EditPage, sidebar: true,
  },
  {
    hash: 'create-collection', name: 'create-page', path: '/site/:siteSlug/collection', exact: true, component: EditPage, sidebar: true,
  },
  {
    name: 'edit-page', path: '/site/:siteSlug/page/:pageSlug', exact: true, component: EditPage, sidebar: true,
  },
  {
    name: 'login', path: '/login', exact: true, component: Login,
  },
  {
    name: 'signup', path: '/signup', exact: true, component: Signup,
  },
];

export default {
  defaultPath,
  routes,
};
