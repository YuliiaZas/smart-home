import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { createUrlTreeRelatedToCurrentRoute } from './create-url-tree-related-to-current-route';

export const createUrlTreeRelatedToParent = (segment: string, route: ActivatedRouteSnapshot, router: Router) => {
  return createUrlTreeRelatedToCurrentRoute(segment, route, router, true);
};
