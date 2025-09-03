import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { ROUTING_PATHS } from '@shared/constants';
import { Auth } from '../auth/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.currentUserWithRequest$.pipe(map((user) => !!user || router.createUrlTree([ROUTING_PATHS.LOGIN])));
};
