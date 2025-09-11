import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map, combineLatest, filter } from 'rxjs';
import { createUrlTreeRelatedToCurrentRoute } from '@shared/utils';
import { DashboardsFacade } from '@state';

export const areDashboardsEmptyGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsFacade = inject(DashboardsFacade);
  const router = inject(Router);

  return combineLatest([dashboardsFacade.userDashboards$, dashboardsFacade.areUserDashboardsLoaded$]).pipe(
    filter(([, areLoaded]) => areLoaded),
    map(([dashboards]) => {
      if (dashboards.length === 0) return true;

      const urlTree = createUrlTreeRelatedToCurrentRoute(dashboards[0].id, route, router);
      return new RedirectCommand(urlTree, { replaceUrl: true });
    })
  );
};
