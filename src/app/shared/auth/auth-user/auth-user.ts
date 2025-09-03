import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { UserProfileInfo } from '../auth/auth-info';
import { LoadingStatus } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthUser {
  #http = inject(HttpClient);
  readonly #profilePath = '/api/user/profile';

  #currentUser$ = new BehaviorSubject<UserProfileInfo | null>(null);
  #profileLoadingStatus$ = new BehaviorSubject<LoadingStatus>(LoadingStatus.NotStarted);

  currentUser$ = this.#currentUser$.asObservable();
  profileLoadingStatus$ = this.#profileLoadingStatus$.asObservable();

  currentUserWithRequest$: Observable<UserProfileInfo | null> = this.currentUser$.pipe(
    switchMap((user) => (user ? of(user) : this.#updateCurrentUser()))
  );

  logoutUser() {
    this.#currentUser$.next(null);
    this.#setProfileLoadingStatus(LoadingStatus.NotStarted);
  }

  #updateCurrentUser(): Observable<UserProfileInfo | null> {
    return this.profileLoadingStatus$.pipe(
      filter((status) => status !== LoadingStatus.Loading),
      tap(() => this.#setProfileLoadingStatus(LoadingStatus.Loading)),
      switchMap(() => this.#fetchUserProfile()),
      tap((user) => {
        this.#currentUser$.next(user);
        this.#setProfileLoadingStatus(LoadingStatus.Success);
      }),
      catchError(() => {
        this.#setProfileLoadingStatus(LoadingStatus.Failure);
        return of(null);
      })
    );
  }

  #setProfileLoadingStatus(loadingStatus: LoadingStatus) {
    this.#profileLoadingStatus$.next(loadingStatus);
  }

  #fetchUserProfile(): Observable<UserProfileInfo | null> {
    return this.#http.get<UserProfileInfo>(`${environment.apiUrl}${this.#profilePath}`);
  }
}
