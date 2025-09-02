import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { NOTIFICATION_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { NotificationService } from '@shared/services';
import { UserDashboards } from '../services';

export const isDashboardValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsService = inject(UserDashboards);
  const router = inject(Router);
  const notification = inject(NotificationService);

  return dashboardsService.userDashboards$.pipe(
    map((dashboards) => dashboards.some((dashboard) => dashboard.id === route.paramMap.get('dashboardId'))),
    map((isDashboardValid) => {
      if (isDashboardValid) return true;

      notification.show(NOTIFICATION_MESSAGES.message.redirect('dashboard'));

      return new RedirectCommand(router.createUrlTree([ROUTING_PATHS.DASHBOARD]));
    })
  );
};
