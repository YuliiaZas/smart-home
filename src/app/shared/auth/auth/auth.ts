import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { LoginRequestInfo, LoginResponseInfo } from './auth-info';
import { AuthUser } from '../auth-user/auth-user';
import { AuthToken } from '../auth-token/auth-token';
import { LoadingStatus } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private authUserService = inject(AuthUser);
  private authTokenService = inject(AuthToken);

  currentToken$ = this.authTokenService.currentToken$;
  currentUser$ = this.authUserService.currentUser$;
  currentUserWithRequest$ = this.authUserService.currentUserWithRequest$;
  isAuthenticated$ = combineLatest([this.authUserService.currentUser$, this.authTokenService.currentToken$]).pipe(
    map(([user, token]) => !!(user && token))
  );
  tokenLoadingStatus$ = this.authTokenService.tokenLoadingStatus$;
  invalidCredentials$ = this.authTokenService.invalidCredentials$;
  isTokenLoading$ = this.authTokenService.tokenLoadingStatus$.pipe(map((status) => status === LoadingStatus.Loading));

  login(loginRequest: LoginRequestInfo): Observable<LoginResponseInfo> {
    return this.authTokenService.loginUser(loginRequest);
  }

  logout(): void {
    this.authTokenService.logoutUser();
    this.authUserService.logoutUser();
  }

  checkAuthentication(): void {
    this.authTokenService.updateCurrentToken();
  }

  setTokenLoadingStatus(loadingStatus: LoadingStatus): void {
    this.authTokenService.setTokenLoadingStatus(loadingStatus);
  }

  setInvalidCredentials(isInvalidCredentials: boolean): void {
    this.authTokenService.setInvalidCredentials(isInvalidCredentials);
  }

  getIsUrlForToken(ulr: string): boolean {
    return this.authTokenService.getIsUrlForToken(ulr);
  }
}
