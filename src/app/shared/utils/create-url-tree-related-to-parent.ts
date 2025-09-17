import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { createUrlTreeRelatedToCurrentRoute } from './create-url-tree-related-to-current-route';

export const createUrlTreeRelatedToParent = (
  segment: string,
  route: ActivatedRouteSnapshot,
  router: Router
): UrlTree => {
  return createUrlTreeRelatedToCurrentRoute(segment, route, router, true);
};
