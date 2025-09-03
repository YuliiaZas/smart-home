import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { createUrlTreeRelatedToCurrentRoute } from '@shared/utils';
import { UserDashboards } from '../services';

export const areTabsEmptyGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsService = inject(UserDashboards);
  const router = inject(Router);

  return dashboardsService.currentDashboardTabs$.pipe(
    map((tabs) => {
      if (!tabs?.length) return true;

      const urlTree = createUrlTreeRelatedToCurrentRoute(tabs[0].id, route, router);
      return new RedirectCommand(urlTree, { replaceUrl: true });
    })
  );
};
