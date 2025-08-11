import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { createUrlTreeRelatedToCurrentRoute } from '@shared/utils';
import { UserDashboards } from '../services';

export const isTabValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsService = inject(UserDashboards);
  const router = inject(Router);

  return dashboardsService.currentDashboardTabs$.pipe(
    map((tabs) => tabs.some((tab) => tab.id === route.paramMap.get('tabId'))),
    map((isTabValid) => {
      if (isTabValid) return true;

      const urlTree = createUrlTreeRelatedToCurrentRoute('**', route, router);
      return new RedirectCommand(urlTree, { skipLocationChange: true });
    })
  );
};
