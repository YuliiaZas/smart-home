import { inject, Injectable } from '@angular/core';
import { combineLatest, filter, map, Observable, pairwise } from 'rxjs';
import { LoginRequestInfo, LoginResponseInfo, SignupRequestInfo } from './auth-info';
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

  readonly authStateChanged$ = this.isAuthenticated$.pipe(
    pairwise(),
    map(([previous, current]) => ({ previous, current })),
    filter(({ previous, current }) => previous !== current)
  );

  readonly userLoggedIn$ = this.authStateChanged$.pipe(
    filter(({ previous, current }) => !previous && current),
    map(() => true)
  );

  readonly userLoggedOut$ = this.authStateChanged$.pipe(
    filter(({ previous, current }) => previous && !current),
    map(() => true)
  );

  login(loginRequest: LoginRequestInfo): Observable<LoginResponseInfo> {
    return this.authTokenService.loginUser(loginRequest);
  }

  signup(signupRequest: SignupRequestInfo): Observable<LoginResponseInfo> {
    return this.authTokenService.signupNewUser(signupRequest);
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
