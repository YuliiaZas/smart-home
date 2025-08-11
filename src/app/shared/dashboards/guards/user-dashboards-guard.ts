import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { filter, map } from 'rxjs';
import { UserDashboards } from '../services';

export const userDashboardsGuard: CanActivateFn = () => {
  const dashboardsService = inject(UserDashboards);

  return dashboardsService.isDashboardsFetching$.pipe(
    filter((isFetching) => isFetching === false),
    map(() => true)
  );
};
