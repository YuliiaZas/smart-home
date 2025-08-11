import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { ROUTING_PATHS } from '@shared/constants';
import { Auth } from '../auth/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.isCurrentUserFetching$.pipe(
    filter((isFetching) => !isFetching),
    switchMap(() =>
      authService.isAuthenticated$.pipe(
        map((isAuthenticated) => isAuthenticated || router.createUrlTree([ROUTING_PATHS.LOGIN]))
      )
    )
  );
};
