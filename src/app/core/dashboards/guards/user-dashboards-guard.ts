import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { filter, map } from 'rxjs';
import { DashboardsFacade } from '@state';

export const userDashboardsGuard: CanActivateFn = () => {
  const dashboardsFacade = inject(DashboardsFacade);
  return dashboardsFacade.areUserDashboardsLoaded$.pipe(
    filter((areLoaded) => areLoaded),
    map(() => true)
  );
};
