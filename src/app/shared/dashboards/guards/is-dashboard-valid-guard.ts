import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserDashboards } from '../services';

export const isDashboardValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsService = inject(UserDashboards);
  const router = inject(Router);

  return dashboardsService.userDashboards$.pipe(
    map((dashboards) => dashboards.some((dashboard) => dashboard.id === route.paramMap.get('dashboardId'))),
    map((isDashboardValid) => {
      if (isDashboardValid) return true;
      return new RedirectCommand(router.parseUrl('**'), { skipLocationChange: true });
    })
  );
};
