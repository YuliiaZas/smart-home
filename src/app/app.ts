import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from '@shared/layout/side-nav/side-nav';
import { Spinner } from '@shared/components';
import { executeWithDestroy } from '@shared/utils';
import { AppService } from '@core/services';

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
    executeWithDestroy(this.#appService.navigationStart$, this.#destroyRef, () => {
      this.isLoading.set(true);
      this.#appService.checkAuthentication();
    });

    executeWithDestroy(this.#appService.navigationEnd$, this.#destroyRef, () => this.isLoading.set(false));
  }

  addDashboard() {
    executeWithDestroy(this.#appService.addDashboard(), this.#destroyRef);
  }

  logout() {
    this.#appService.logout();
  }
}
