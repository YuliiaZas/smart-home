import { Routes } from '@angular/router';
import { authGuard, loginGuard } from '@shared/auth';
import { ROUTING_PATHS } from '@shared/constants';

export const routes: Routes = [
  { path: ROUTING_PATHS.HOME, redirectTo: ROUTING_PATHS.DASHBOARD, pathMatch: 'full' },
  {
    // path: 'dashboard/:dashboardId/:tabId',
    path: ROUTING_PATHS.DASHBOARD,
    canActivate: [authGuard],
    loadComponent: () => import('./home/home').then((m) => m.Home),
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
