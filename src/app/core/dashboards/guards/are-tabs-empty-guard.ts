import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { map } from 'rxjs';
import { createUrlTreeRelatedToCurrentRoute } from '@shared/utils';
import { TabsFacade } from '@state';

export const areTabsEmptyGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tabsFacade = inject(TabsFacade);
  const router = inject(Router);

  return tabsFacade.tabsIds$.pipe(
    map((tabsIds) => {
      if (tabsIds.length === 0) return true;

      const urlTree = createUrlTreeRelatedToCurrentRoute(tabsIds[0], route, router);
      return new RedirectCommand(urlTree, { replaceUrl: true });
    })
  );
};
