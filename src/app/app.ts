import { Component, DestroyRef, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
import { SideNav } from '@shared/layout/side-nav/side-nav';
import { Spinner } from '@shared/components';
import { Auth } from '@shared/auth';
import { ROUTING_PATHS } from '@shared/constants';
import { DashboardInfo, FailureAction, NavInfo } from '@shared/models';
import { DashboardInfoFormService } from '@shared/edit';
import { DashboardsFacade } from '@state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, SideNav, Spinner],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  private authService = inject(Auth);
  private dashboardsFacade = inject(DashboardsFacade);
  private dashboardInfoFormService = inject(DashboardInfoFormService);
  private destroyRef = inject(DestroyRef);

  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly currentUser$ = this.authService.currentUser$;
  readonly isLoginPage$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.url === `/${ROUTING_PATHS.LOGIN}`)
  );
  readonly showSideNav$ = combineLatest([this.authService.isAuthenticated$, this.isLoginPage$]).pipe(
    map(([isAuthenticated, isLogin]) => isAuthenticated && !isLogin)
  );

  dashboards$: Observable<NavInfo[]> = this.dashboardsFacade.userDashboardsWithRequest$.pipe(
    map((dashboards) =>
      (dashboards || []).map((dashboard) => ({
        ...dashboard,
        link: `/${ROUTING_PATHS.DASHBOARD}/${dashboard.id}`,
      }))
    )
  );

  addDashboardFailureAction = toSignal<FailureAction | null>(this.dashboardsFacade.addDashboardError$, {
    initialValue: null,
  });
  updateDashboardsListSuccess$: Observable<void> = this.dashboardsFacade.userDashboardsShouldBeRefetched$.pipe(
    filter((isSuccess) => isSuccess),
    map(() => void 0)
  );

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading$.next(true);
        this.authService.checkAuthentication();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationSkipped
      ) {
        this.isLoading$.next(false);
      }
    });
  }

  addDashboard() {
    this.dashboardInfoFormService
      .addNew(this.addDashboardFailureAction, this.updateDashboardsListSuccess$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dashboardInfo: DashboardInfo | null) => {
        if (dashboardInfo) {
          this.dashboardsFacade.addDashboard(dashboardInfo);
        }
        this.dashboardsFacade.clearDashboardListError();
      });
  }

  logout() {
    this.dashboardsFacade.resetDashboards();
    this.authService.logout();
    this.router.navigate([ROUTING_PATHS.LOGIN]);
  }
}
