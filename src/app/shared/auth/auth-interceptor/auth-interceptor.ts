import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, take, throwError } from 'rxjs';
import { ROUTING_PATHS } from '@shared/constants';
import { InvalidCredentialsError } from '@shared/errors';
import { Auth } from '../auth/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.includes(ROUTING_PATHS.LOGIN))
    return next(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return throwError(() => new InvalidCredentialsError());
        }
        return throwError(() => error);
      })
    );

  const authService = inject(Auth);
  const router = inject(Router);

  return authService.currentToken$.pipe(
    take(1),
    switchMap((userToken) => {
      if (!userToken) {
        router.navigate([ROUTING_PATHS.LOGIN]);
        return EMPTY;
      }

      const modifiedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${userToken}`),
      });

      return next(modifiedRequest);
    })
  );
};
