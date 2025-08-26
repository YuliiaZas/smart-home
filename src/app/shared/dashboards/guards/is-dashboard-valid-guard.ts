import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { DashboardsFacade } from '@state';

export const isDashboardValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsFacade = inject(DashboardsFacade);
  const router = inject(Router);
  return dashboardsFacade.userDashboardsWithRequest$.pipe(
    map((dashboards) => dashboards.some((dashboard) => dashboard.id === route.paramMap.get('dashboardId'))),
    map((isDashboardValid) => {
      if (isDashboardValid) return true;
      return new RedirectCommand(router.parseUrl('**'), { skipLocationChange: true });
    })
  );
};
