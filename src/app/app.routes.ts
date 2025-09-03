import { Routes } from '@angular/router';
import { authGuard, loginGuard } from '@shared/auth';
import { ROUTING_PATHS } from '@shared/constants';
import {
  areDashboardsEmptyGuard,
  areTabsEmptyGuard,
  currentDashboardGuard,
  userDashboardsGuard,
  isDashboardValidGuard,
  isTabValidGuard,
} from '@shared/dashboards/guards';

export const routes: Routes = [
  { path: ROUTING_PATHS.HOME, redirectTo: ROUTING_PATHS.DASHBOARD, pathMatch: 'full' },
  {
    path: ROUTING_PATHS.DASHBOARD,
    canActivate: [authGuard, userDashboardsGuard],
    loadComponent: () => import('./home-redirect/home-redirect').then((m) => m.HomeRedirect),
    children: [
      {
        path: '',
        canActivate: [areDashboardsEmptyGuard],
        loadComponent: () => import('./home-empty/home-empty').then((m) => m.HomeEmpty),
      },
      {
        path: ':dashboardId',
        canActivate: [isDashboardValidGuard, currentDashboardGuard],
        loadComponent: () => import('./home/home').then((m) => m.Home),
        children: [
          {
            path: '',
            canActivate: [areTabsEmptyGuard],
            loadComponent: () => import('./home-empty/home-empty').then((m) => m.HomeEmpty),
          },
          {
            path: ':tabId',
            canActivate: [isTabValidGuard],
            loadComponent: () => import('./home-tab/home-tab').then((m) => m.HomeTab),
          },
          {
            path: '**',
            loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
          },
        ],
      },
      {
        path: '**',
        loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
  {
    path: ROUTING_PATHS.LOGIN,
    canActivate: [loginGuard],
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: '**',
    canActivate: [authGuard],
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
