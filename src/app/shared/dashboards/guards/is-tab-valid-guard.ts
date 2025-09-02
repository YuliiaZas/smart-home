import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { createUrlTreeRelatedToParent } from '@shared/utils';
import { NotificationService } from '@shared/services';
import { NOTIFICATION_MESSAGES } from '@shared/constants';
import { UserDashboards } from '../services';

export const isTabValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dashboardsService = inject(UserDashboards);
  const router = inject(Router);
  const notification = inject(NotificationService);

  return dashboardsService.currentDashboardTabs$.pipe(
    map((tabs) => tabs.some((tab) => tab.id === route.paramMap.get('tabId'))),
    map((isTabValid) => {
      if (isTabValid) return true;

      notification.show(NOTIFICATION_MESSAGES.message.redirect('tab'));

      const urlTree = createUrlTreeRelatedToParent('', route, router);
      return new RedirectCommand(urlTree, { replaceUrl: true });
    })
  );
};
