import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, take, throwError } from 'rxjs';
import { HTTPStatusCode, NOTIFICATION_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { NotificationService } from '@shared/services';
import { LoadingStatus } from '@shared/models';
import { Auth } from '../auth/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (authService.getIsUrlForToken(request.url))
    return next(request).pipe(
      catchError((error) => {
        authService.setTokenLoadingStatus(LoadingStatus.Failure);
        if (error.status === HTTPStatusCode.Unauthorized || error.status === HTTPStatusCode.Conflict) {
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
        logoutAndRedirect(authService, router, notification);
        throw new Error('No token found');
      }

      const modifiedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${userToken}`),
      });
      return next(modifiedRequest);
    }),
    catchError((error) => {
      if (error.status === HTTPStatusCode.Unauthorized) {
        logoutAndRedirect(authService, router, notification);
        return EMPTY;
      }
      return throwError(() => error);
    })
  );
};

function logoutAndRedirect(authService: Auth, router: Router, notification: NotificationService) {
  notification.show(NOTIFICATION_MESSAGES.message.unauthorized);

  router.navigate([ROUTING_PATHS.LOGIN]);
  authService.logout();
}
