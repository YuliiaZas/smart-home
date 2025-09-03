import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { createUrlTreeRelatedToCurrentRoute } from '@shared/utils';
import { UserDashboards } from '../services';

export const areDashboardsEmptyGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsService = inject(UserDashboards);
  const router = inject(Router);

  return dashboardsService.userDashboards$.pipe(
    map((dashboards) => {
      if (!dashboards?.length) return true;

      const urlTree = createUrlTreeRelatedToCurrentRoute(dashboards[0].id, route, router);
      return new RedirectCommand(urlTree, { replaceUrl: true });
    })
  );
};
