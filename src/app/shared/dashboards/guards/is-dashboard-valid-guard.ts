import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { combineLatest, filter, map } from 'rxjs';
import { DashboardsFacade } from '@state';
import { NOTIFICATION_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { NotificationService } from '@shared/services';
import { Entity } from '@shared/models';

export const isDashboardValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsFacade = inject(DashboardsFacade);
  const router = inject(Router);
  const notification = inject(NotificationService);

  return combineLatest([dashboardsFacade.userDashboards$, dashboardsFacade.areUserDashboardsLoaded$]).pipe(
    filter(([, areLoaded]) => areLoaded),
    map(([dashboards]) => dashboards.some((dashboard) => dashboard.id === route.paramMap.get('dashboardId'))),
    map((isDashboardValid) => {
      if (isDashboardValid) return true;

      notification.show(NOTIFICATION_MESSAGES.message.redirect(Entity.DASHBOARD));

      return new RedirectCommand(router.createUrlTree([ROUTING_PATHS.DASHBOARD]));
    })
  );
};
