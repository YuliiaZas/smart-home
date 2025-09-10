import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, distinctUntilChanged, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { LoadingStatus } from '@shared/models';
import { LoginRequestInfo, LoginResponseInfo, SignupRequestInfo } from '../auth/auth-info';

@Injectable({
  providedIn: 'root',
})
export class AuthToken {
  readonly #tokenKey = 'auth-token';
  readonly #loginPath = '/api/user/login';
  readonly #signupPath = '/api/user/register';

  #http = inject(HttpClient);

  #currentToken$ = new BehaviorSubject<string | null>(null);
  #tokenLoadingStatus$ = new BehaviorSubject<LoadingStatus>(LoadingStatus.NotStarted);
  #invalidCredentials$ = new BehaviorSubject<boolean>(false);

  currentToken$ = this.#currentToken$.asObservable().pipe(distinctUntilChanged());
  tokenLoadingStatus$ = this.#tokenLoadingStatus$.asObservable();
  invalidCredentials$ = this.#invalidCredentials$.asObservable().pipe(distinctUntilChanged());

  constructor() {
    this.updateCurrentToken();
  }

  setTokenLoadingStatus(loadingStatus: LoadingStatus) {
    this.#tokenLoadingStatus$.next(loadingStatus);
  }

  loginUser(loginRequest: LoginRequestInfo): Observable<LoginResponseInfo> {
    this.setTokenLoadingStatus(LoadingStatus.Loading);
    this.setInvalidCredentials(false);

    return this.#fetchToken(loginRequest).pipe(
      tap(({ token }) => {
        this.#setToken(token);
        this.setTokenLoadingStatus(LoadingStatus.Success);
      })
    );
  }

  signupNewUser(signupRequest: SignupRequestInfo): Observable<LoginResponseInfo> {
    this.setTokenLoadingStatus(LoadingStatus.Loading);
    this.setInvalidCredentials(false);

    return this.#fetchTokenForNewUser(signupRequest).pipe(
      tap(({ token }) => {
        this.#setToken(token);
        this.setTokenLoadingStatus(LoadingStatus.Success);
      })
    );
  }

  logoutUser() {
    this.#setToken(null);
    this.setTokenLoadingStatus(LoadingStatus.NotStarted);
  }

  updateCurrentToken() {
    const currentToken = localStorage.getItem(this.#tokenKey);
    this.#currentToken$.next(currentToken);
  }

  getIsUrlForToken(ulr: string): boolean {
    return ulr.includes(this.#loginPath) || ulr.includes(this.#signupPath);
  }

  setInvalidCredentials(isInvalidCredentials: boolean): void {
    this.#invalidCredentials$.next(isInvalidCredentials);
  }

  #setToken(token: string | null) {
    if (token) {
      localStorage.setItem(this.#tokenKey, token);
    } else {
      localStorage.removeItem(this.#tokenKey);
    }
    this.#currentToken$.next(token);
  }

  #fetchToken(loginRequest: LoginRequestInfo): Observable<LoginResponseInfo> {
    return this.#http.post<LoginResponseInfo>(`${environment.apiUrl}${this.#loginPath}`, loginRequest);
  }

  #fetchTokenForNewUser(signupRequest: SignupRequestInfo): Observable<LoginResponseInfo> {
    return this.#http.post<LoginResponseInfo>(`${environment.apiUrl}${this.#signupPath}`, signupRequest);
  }
}
