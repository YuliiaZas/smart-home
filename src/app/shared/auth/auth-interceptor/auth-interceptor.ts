import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, take, throwError } from 'rxjs';
import { ROUTING_PATHS } from '@shared/constants';
import { LoadingStatus } from '@shared/models';
import { Auth } from '../auth/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.getIsUrlForToken(request.url))
    return next(request).pipe(
      catchError((error) => {
        authService.setTokenLoadingStatus(LoadingStatus.Failure);
        if (error.status === 401) {
          authService.setInvalidCredentials(true);
          return EMPTY;
        }
        return throwError(() => error);
      })
    );

  return authService.currentToken$.pipe(
    take(1),
    switchMap((userToken) => {
      if (!userToken) {
        router.navigate([ROUTING_PATHS.LOGIN]);
        authService.logout();
        return EMPTY;
      }

      const modifiedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${userToken}`),
      });

      return next(modifiedRequest);
    })
  );
};
