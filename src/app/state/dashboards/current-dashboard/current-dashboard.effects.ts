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
          map((dashboard) => currentDashboardApiActions.loadDashboardDataSuccess({ dashboard })),
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
      map(({ dashboard }) => currentDashboardActions.propagateCurrentDashboardData({ dashboard }))
    )
  );

  updateDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardApiActions.updateDashboard),
      switchMap(({ dashboardId, dashboardInfo, dashboardData }) =>
        this.dashboardsService.updateDashboardData(dashboardId, dashboardInfo, dashboardData).pipe(
          map((dashboard) => currentDashboardApiActions.updateDashboardSuccess({ dashboard })),
          catchError((error) =>
            of(
              currentDashboardApiActions.updateDashboardFailure({
                error,
                action: FailureAction.UpdateCurrentDashboardData,
              })
            )
          )
        )
      )
    )
  );

  updateDashboardSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardApiActions.updateDashboardSuccess),
      map(() => currentDashboardActions.exitEditMode())
    )
  );
}
