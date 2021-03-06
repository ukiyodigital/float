import Login from '_/components/Login/Login';
import Signup from '_/components/Signup/Signup';

import { SiteList, SiteBreadcrumbAction } from '_/components/SiteList';
import SiteDetail from '_/components/SiteDetail/SiteDetail';

import EditPage from '_/components/EditPage/EditPage';
import EditFlock from '_/components/EditFlock/EditFlock';

import SettingsAction from '_/components/Common/SettingsAction/SettingsAction';

export const defaultPath = '/site';

export const routes = [
  {
    name: 'sites', path: '/site', exact: true, component: SiteList, loginRequired: true, breadcrumbs: true, breadcrumbComponent: SiteBreadcrumbAction,
  },
  {
    name: 'site-detail', path: '/site/:siteSlug', exact: true, component: SiteDetail, loginRequired: true, breadcrumbs: true, breadcrumbComponent: SettingsAction,
  },
  {
    name: 'edit-flock', path: '/site/:siteSlug/flock/:flockSlug/edit', exact: true, component: EditFlock, sidebar: true, loginRequired: true, breadcrumbs: true,
  },
  {
    name: 'edit-page', path: '/site/:siteSlug/page/:pageSlug/edit', exact: true, component: EditPage, sidebar: true, loginRequired: true, breadcrumbs: true,
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
