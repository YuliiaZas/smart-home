import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { filter, map } from 'rxjs';
import { UserDashboards } from '../services';

export const currentDashboardGuard: CanActivateFn = (route) => {
  const dashboardsService = inject(UserDashboards);

  dashboardsService.setCurrentDashboardId(route.paramMap.get('dashboardId'));

  return dashboardsService.isCurrentDashboardDataFetching$.pipe(
    filter((isFetching) => isFetching === false),
    map(() => true)
  );
};
