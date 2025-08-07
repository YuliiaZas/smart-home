import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SideNav } from '@shared/layout/side-nav/side-nav';
import { Spinner } from '@shared/components';
import { Auth } from '@shared/auth';
import { ROUTING_PATHS } from '@shared/constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, SideNav, Spinner],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected navItems = [
    { label: 'Overview', icon: 'dashboard', link: '/dashboard', active: true },
    { label: 'About', icon: 'info', link: '/about' },
  ];

  private router = inject(Router);
  private authService = inject(Auth);

  readonly isLoading = signal(false);
  readonly isAuthenticated$ = this.authService.isAuthenticated$;
  readonly currentUser$ = this.authService.currentUser$;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
        this.authService.checkAuthentication();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate([ROUTING_PATHS.LOGIN]);
  }
}
