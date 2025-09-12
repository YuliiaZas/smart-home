import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { UserDashboards } from '@shared/dashboards/services';
import { Auth } from '@shared/auth';
import { FailureAction, LoadingStatus } from '@shared/models';
import { ROUTING_PATHS } from '@shared/constants';
import { dashboardsListActions, dashboardsListApiActions } from './dashboards-list.actions';
import { dashboardsListFeature } from './dashboards-list.state';

@Injectable()
export class DashboardsListEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private dashboardsService = inject(UserDashboards);
  private auth = inject(Auth);
  private router = inject(Router);

  loadDashboardsOnLogin$ = createEffect(() =>
    this.auth.userLoggedIn$.pipe(map(() => dashboardsListApiActions.loadUserDashboards()))
  );

  clearDashboardsOnLogout$ = createEffect(() =>
    this.auth.userLoggedOut$.pipe(map(() => dashboardsListActions.resetUserDashboards()))
  );

  loadDashboardsWhenNeeded$ = createEffect(() =>
    combineLatest([this.store.select(dashboardsListFeature.selectLoadingStatus), this.auth.isAuthenticated$]).pipe(
      filter(
        ([loadingStatus, isAuthenticated]) =>
          isAuthenticated && (loadingStatus === LoadingStatus.NotStarted || loadingStatus === LoadingStatus.NotUpdated)
      ),
      map(() => dashboardsListApiActions.loadUserDashboards())
    )
  );

  loadUserDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListApiActions.loadUserDashboards, dashboardsListApiActions.updateDashboardInfoSuccess),
      switchMap(() =>
        this.dashboardsService.fetchUserDashboards().pipe(
          map((dashboardsList) => dashboardsListApiActions.loadUserDashboardsSuccess({ dashboardsList })),
          catchError((error) =>
            of(dashboardsListApiActions.loadUserDashboardsFailure({ error, action: FailureAction.LoadUserDashboards }))
          )
        )
      )
    )
  );

  addDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListApiActions.addDashboard),
      switchMap(({ dashboardInfo }) =>
        this.dashboardsService.addDashboard(dashboardInfo).pipe(
          map(({ id }) => dashboardsListApiActions.addDashboardSuccess({ dashboardId: id })),
          catchError((error) =>
            of(
              dashboardsListApiActions.addDashboardFailure({
                error,
                data: dashboardInfo,
                action: FailureAction.AddDashboard,
              })
            )
          )
        )
      )
    )
  );

  addDashboardSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(dashboardsListApiActions.addDashboardSuccess),
        tap(({ dashboardId }) => this.router.navigate([ROUTING_PATHS.DASHBOARD, dashboardId]))
      ),
    { dispatch: false }
  );

  updateCurrentDashboardInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListApiActions.updateDashboardInfo),
      map(({ dashboardInfo }) => dashboardInfo),
      switchMap((dashboardInfo) =>
        this.dashboardsService.updateDashboardInfo(dashboardInfo).pipe(
          map(() => dashboardsListApiActions.updateDashboardInfoSuccess()),
          catchError((error) =>
            of(
              dashboardsListApiActions.updateDashboardInfoFailure({
                error,
                action: FailureAction.UpdateCurrentDashboardInfo,
              })
            )
          )
        )
      )
    )
  );

  deleteDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListApiActions.deleteDashboard),
      switchMap(({ dashboardId }) =>
        this.dashboardsService.deleteDashboard(dashboardId).pipe(
          map(() => dashboardsListApiActions.deleteDashboardSuccess()),
          tap(() => this.router.navigate([ROUTING_PATHS.DASHBOARD])),
          catchError((error) =>
            of(
              dashboardsListApiActions.deleteDashboardFailure({
                error,
                action: FailureAction.DeleteCurrentDashboard,
              })
            )
          )
        )
      )
    )
  );
}
