import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, finalize, Observable, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { UserProfileInfo } from '../auth/auth-info';

@Injectable({
  providedIn: 'root',
})
export class AuthUser {
  private http = inject(HttpClient);
  private readonly profilePath = '/api/user/profile';

  private loggedUser$ = new BehaviorSubject<UserProfileInfo | null>(null);
  private isProfileFetching$ = new BehaviorSubject<boolean>(false);

  currentUser$ = this.loggedUser$.asObservable();
  isCurrentUserFetching$ = this.isProfileFetching$.asObservable();

  logoutUser() {
    this.loggedUser$.next(null);
  }

  updateCurrentUser(): Observable<UserProfileInfo | null> {
    return this.fetchUserProfile().pipe(tap((user) => this.loggedUser$.next(user)));
  }

  private fetchUserProfile(): Observable<UserProfileInfo | null> {
    if (this.isProfileFetching$.value) return EMPTY;

    this.isProfileFetching$.next(true);

    return this.http.get<UserProfileInfo>(`${environment.apiUrl}${this.profilePath}`).pipe(
      catchError(() => of(null)),
      finalize(() => this.isProfileFetching$.next(false))
    );
  }
}
