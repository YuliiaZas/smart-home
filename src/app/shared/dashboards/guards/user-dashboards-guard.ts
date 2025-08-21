import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { DashboardsFacade } from '@state';

export const userDashboardsGuard: CanActivateFn = () => {
  const dashboardsFacade = inject(DashboardsFacade);

  return dashboardsFacade.userDashboards$.pipe(map(() => true));
};
