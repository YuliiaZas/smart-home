import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { filter } from 'rxjs';
import { DashboardsFacade } from '@state';

export const currentDashboardGuard: CanActivateFn = (route) => {
  const dashboardsFacade = inject(DashboardsFacade);

  dashboardsFacade.setCurrentDashboardId(route.paramMap.get('dashboardId'));

  return dashboardsFacade.isCurrentDashboardLoaded$.pipe(filter((isLoaded) => isLoaded));
};
