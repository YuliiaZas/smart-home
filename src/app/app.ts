import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { SideNav } from '@shared/layout/side-nav/side-nav';
import { Spinner } from '@shared/components';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideNav, Spinner],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  #appService = inject(AppService);
  #destroyRef = inject(DestroyRef);

  isLoading = signal(false);

  readonly currentUser = this.#appService.currentUser;

  readonly showSideNav = this.#appService.showSideNav;

  readonly dashboards = this.#appService.dashboards;

  constructor() {
    this.#appService.navigationStart$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.isLoading.set(true);
      this.#appService.checkAuthentication();
    });

    this.#appService.navigationEnd$.pipe(takeUntilDestroyed()).subscribe(() => this.isLoading.set(false));
  }

  addDashboard() {
    this.#appService.addDashboard().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe();
  }

  logout() {
    this.#appService.logout();
  }
}
