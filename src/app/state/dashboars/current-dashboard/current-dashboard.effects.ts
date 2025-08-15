import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserDashboards } from '@shared/dashboards/services';
import { FailureAction } from '@shared/models';
import { currentDashboardActions, dashboardApiActions } from './current-dashboard.actions';

@Injectable()
export class CurrentDashboardEffects {
  private actions$ = inject(Actions);
  private dashboardsService = inject(UserDashboards);

  setCurrentDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.setCurrentDashboardId),
      map(({ dashboardId }) => dashboardApiActions.loadDashboardData({ dashboardId }))
    )
  );

  loadCurrentDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardApiActions.loadDashboardData),
      switchMap(({ dashboardId }) =>
        this.dashboardsService.fetchDashboardData(dashboardId).pipe(
          map((dashboardData) => dashboardApiActions.loadDashboardDataSuccess({ dashboardData })),
          catchError((error) =>
            of(
              dashboardApiActions.loadDashboardDataFailure({
                error,
                action: FailureAction.LoadCurrentDashboard,
              })
            )
          )
        )
      )
    )
  );

  loadCurrentDashboardDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardApiActions.loadDashboardDataSuccess),
      map(({ dashboardData }) => currentDashboardActions.setCurrentDashboardData({ dashboardData }))
    )
  );

  updateDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardApiActions.updateDashboardData),
      switchMap(({ dashboardId, dashboardData }) =>
        this.dashboardsService.updateDashboardData(dashboardId, dashboardData).pipe(
          map((dashboardData) => dashboardApiActions.updateDashboardDataSuccess({ dashboardData })),
          catchError((error) =>
            of(
              dashboardApiActions.updateDashboardDataFailure({
                error,
                action: FailureAction.UpdateCurrentDashboardData,
              })
            )
          )
        )
      )
    )
  );

  updateCurrentDashboardDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardApiActions.updateDashboardDataSuccess),
      switchMap(({ dashboardData }) =>
        from([
          currentDashboardActions.setCurrentDashboardData({ dashboardData }),
          currentDashboardActions.exitEditMode(),
        ])
      )
    )
  );
}
