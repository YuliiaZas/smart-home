import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { LoginRequestInfo, LoginResponseInfo, UserProfileInfo } from './auth-info';
import { AuthUser } from '../auth-user/auth-user';
import { environment } from 'src/environments/environments';
import { AuthToken } from '../auth-token/auth-token';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly loginPath = '/api/user/login';

  private http = inject(HttpClient);
  private authUserService = inject(AuthUser);
  private authTokenService = inject(AuthToken);

  currentToken$ = this.authTokenService.currentToken$;
  currentUser$ = this.authUserService.currentUser$;
  isCurrentUserFetching$ = this.authUserService.isCurrentUserFetching$;
  isAuthenticated$ = combineLatest([this.authUserService.currentUser$, this.authTokenService.currentToken$]).pipe(
    map(([user, token]) => !!(user && token))
  );

  login(loginRequest: LoginRequestInfo): Observable<UserProfileInfo | null> {
    return this.http.post<LoginResponseInfo>(`${environment.apiUrl}${this.loginPath}`, loginRequest).pipe(
      tap(({ token }) => this.authTokenService.setToken(token)),
      filter(({ token }) => !!token),
      switchMap(() => this.updateCurrentUser())
    );
  }

  logout(): void {
    this.authTokenService.setToken(null);
    this.authUserService.logoutUser();
  }

  updateCurrentUser(): Observable<UserProfileInfo | null> {
    return this.authUserService.updateCurrentUser();
  }

  checkAuthentication(): void {
    this.authTokenService.updateCurrentToken();
  }
}
