import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

export const createUrlTreeRelatedToCurrentRoute = (
  segment: string,
  route: ActivatedRouteSnapshot,
  router: Router,
  siblingRoute?: boolean
): UrlTree => {
  const baseUrl = route.pathFromRoot
    .map((r) => r.url.map((segment) => segment.path).join('/'))
    .filter((value, index, array) => Boolean(value) && (!siblingRoute || index !== array.length - 1))
    .join('/');

  return router.parseUrl(segment ? `${baseUrl}/${segment}` : baseUrl);
};
