import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { ROUTING_PATHS } from '@shared/constants';
import { Auth } from '../auth/auth';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => !isAuthenticated || router.createUrlTree([ROUTING_PATHS.HOME]))
  );
};
