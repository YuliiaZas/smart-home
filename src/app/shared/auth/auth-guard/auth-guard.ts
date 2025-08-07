import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { ROUTING_PATHS } from '@shared/constants';
import { Auth } from '../auth/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.isCurrentUserFetching$.pipe(
    filter((isFetching) => !isFetching),
    take(1),
    switchMap(() =>
      authService.isAuthenticated$.pipe(
        take(1),
        map((isAuthenticated) => isAuthenticated || router.createUrlTree([ROUTING_PATHS.LOGIN]))
      )
    )
  );
};
