import { ActivatedRouteSnapshot, Router } from '@angular/router';

export const createUrlTreeRelatedToCurrentRoute = (segment: string, route: ActivatedRouteSnapshot, router: Router) => {
  const currentUrl = route.pathFromRoot
    .map((r) => r.url.map((segment) => segment.path).join('/'))
    .filter(Boolean)
    .join('/');

  return router.parseUrl(`${currentUrl}/${segment}`);
};
