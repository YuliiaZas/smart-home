import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { Auth, UserProfileInfo } from '@shared/auth';
import { ROUTING_PATHS } from '@shared/constants';
import { NavInfo } from '@shared/models';
import { DashboardInfoFormService } from '@shared/edit-entity';
import { DashboardsFacade } from '@state';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private router = inject(Router);
  private authService = inject(Auth);
  private dashboardsFacade = inject(DashboardsFacade);
  private dashboardInfoFormService = inject(DashboardInfoFormService);

  private isLoginPage$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.url === `/${ROUTING_PATHS.LOGIN}`)
  );
  readonly currentUser = toSignal<UserProfileInfo | null>(this.authService.currentUser$, { initialValue: null });
  readonly showSideNav = toSignal<boolean>(
    combineLatest([this.authService.isAuthenticated$, this.isLoginPage$]).pipe(
      map(([isAuthenticated, isLogin]) => isAuthenticated && !isLogin)
    )
  );

  readonly dashboards = toSignal<NavInfo[]>(
    this.dashboardsFacade.userDashboards$.pipe(
      map((dashboards) =>
        (dashboards || []).map((dashboard) => ({
          ...dashboard,
          link: `/${ROUTING_PATHS.DASHBOARD}/${dashboard.id}`,
        }))
      )
    )
  );

  readonly navigationStart$ = this.router.events.pipe(filter((event) => event instanceof NavigationStart));
  readonly navigationEnd$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationSkipped ||
        event instanceof NavigationCancel
    )
  );

  checkAuthentication() {
    this.authService.checkAuthentication();
  }

  addDashboard(): Observable<void> {
    return this.dashboardInfoFormService.addNew();
  }

  logout() {
    this.authService.logout();
    this.router.navigate([ROUTING_PATHS.LOGIN]);
  }
}
