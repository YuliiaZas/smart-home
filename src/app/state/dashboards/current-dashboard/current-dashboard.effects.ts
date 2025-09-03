import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserDashboards } from '@shared/dashboards/services';
import { FailureAction } from '@shared/models';
import { currentDashboardActions, currentDashboardApiActions } from './current-dashboard.actions';

@Injectable()
export class CurrentDashboardEffects {
  private actions$ = inject(Actions);
  private dashboardsService = inject(UserDashboards);

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardApiActions.loadDashboardData),
      switchMap(({ dashboardId }) =>
        this.dashboardsService.fetchDashboardData(dashboardId).pipe(
          map((dashboardData) => currentDashboardApiActions.loadDashboardDataSuccess({ dashboardData })),
          catchError((error) =>
            of(
              currentDashboardApiActions.loadDashboardDataFailure({
                error,
                action: FailureAction.LoadCurrentDashboard,
              })
            )
          )
        )
      )
    )
  );

  loadDashboardDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardApiActions.loadDashboardDataSuccess),
      map(({ dashboardData }) => currentDashboardActions.propagateCurrentDashboardData({ dashboardData }))
    )
  );

  updateDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardApiActions.updateDashboardData),
      switchMap(({ dashboardId, dashboardData }) =>
        this.dashboardsService.updateDashboardData(dashboardId, dashboardData).pipe(
          map((dashboardData) => currentDashboardApiActions.updateDashboardDataSuccess({ dashboardData })),
          catchError((error) =>
            of(
              currentDashboardApiActions.updateDashboardDataFailure({
                error,
                action: FailureAction.UpdateCurrentDashboardData,
              })
            )
          )
        )
      )
    )
  );

  updateDashboardDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardApiActions.updateDashboardDataSuccess),
      map(({ dashboardData }) => currentDashboardActions.propagateCurrentDashboardData({ dashboardData }))
    )
  );
}
