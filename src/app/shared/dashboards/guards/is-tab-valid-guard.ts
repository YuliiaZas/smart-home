import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { createUrlTreeRelatedToParent } from '@shared/utils';
import { TabsFacade } from '@state';
import { NotificationService } from '@shared/services';
import { NOTIFICATION_MESSAGES } from '@shared/constants';
import { Entity } from '@shared/models';

export const isTabValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tabsFacade = inject(TabsFacade);
  const router = inject(Router);
  const notification = inject(NotificationService);

  return tabsFacade.tabsIds$.pipe(
    map((tabsIds) => {
      const tabIdFromRoute = route.paramMap.get('tabId');
      return tabIdFromRoute && tabsIds.includes(tabIdFromRoute) ? tabIdFromRoute : null;
    }),
    map((currentTabId) => {
      if (currentTabId) {
        tabsFacade.setCurrentTab(currentTabId);
        return true;
      }

      notification.show(NOTIFICATION_MESSAGES.message.redirect(Entity.TAB));

      const urlTree = createUrlTreeRelatedToParent('', route, router);
      return new RedirectCommand(urlTree, { replaceUrl: true });
    })
  );
};
