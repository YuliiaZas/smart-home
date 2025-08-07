import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthToken {
  private readonly tokenKey = 'auth-token';

  private token$ = new BehaviorSubject<string | null>(null);

  currentToken$ = this.token$.asObservable().pipe(distinctUntilChanged());

  constructor() {
    this.updateCurrentToken();
  }

  updateCurrentToken() {
    const currentToken = localStorage.getItem(this.tokenKey);
    this.token$.next(currentToken);
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
    this.token$.next(token);
  }
}
