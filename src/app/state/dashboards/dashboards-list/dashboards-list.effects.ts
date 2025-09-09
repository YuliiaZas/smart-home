import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UserDashboards } from '@shared/dashboards/services';
import { dashboardsListApiActions } from './dashboards-list.actions';
import { FailureAction } from '@shared/models';
import { ROUTING_PATHS } from '@shared/constants';
import { Store } from '@ngrx/store';

@Injectable()
export class DashboardsListEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private dashboardsService = inject(UserDashboards);
  private router = inject(Router);

  loadUserDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListApiActions.loadUserDashboards),
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
