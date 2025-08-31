import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { createUrlTreeRelatedToCurrentRoute } from '@shared/utils';
import { TabsFacade } from '@state';

export const isTabValidGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tabsFacade = inject(TabsFacade);
  const router = inject(Router);

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

      const urlTree = createUrlTreeRelatedToCurrentRoute('**', route, router);
      return new RedirectCommand(urlTree, { skipLocationChange: true });
    })
  );
};
