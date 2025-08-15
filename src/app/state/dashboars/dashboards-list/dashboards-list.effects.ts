import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { UserDashboards } from '@shared/dashboards/services';
import { dashboardsListActions } from './dashboards-list.actions';
import { DashboardInfo, FailureAction } from '@shared/models';
import { ROUTING_PATHS } from '@shared/constants';
import { Store } from '@ngrx/store';

@Injectable()
export class DashboardsListEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private dashboardsService = inject(UserDashboards);
  private roter = inject(Router);

  loadUserDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        dashboardsListActions.loadUserDashboards,
        dashboardsListActions.addDashboardSuccess,
        dashboardsListActions.updateCurrentDashboardInfoSuccess,
        dashboardsListActions.deleteDashboardSuccess
      ),
      switchMap(() =>
        this.dashboardsService.fetchUserDashboards().pipe(
          map((dashboardsList) => dashboardsListActions.loadUserDashboardsSuccess({ dashboardsList })),
          catchError((error) =>
            of(dashboardsListActions.loadUserDashboardsFailure({ error, action: FailureAction.LoadUserDashboards }))
          )
        )
      )
    )
  );

  addDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListActions.addDashboard),
      switchMap(({ dashboardInfo }) =>
        this.dashboardsService.addDashboard(dashboardInfo).pipe(
          tap(({ id }) => this.roter.navigate([ROUTING_PATHS.DASHBOARD, id])),
          map(({ id }) => dashboardsListActions.addDashboardSuccess({ dashboardId: id })),
          catchError((error) =>
            of(dashboardsListActions.addDashboardFailure({ error, action: FailureAction.AddDashboard }))
          )
        )
      )
    )
  );

  updateDashboardInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListActions.updateCurrentDashboardInfo),
      switchMap(() => this.store.select(dashboardsListActions.changeCurrentDashboardInfo)),
      map(({ dashboardInfo }) => dashboardInfo),
      filter((dashboardInfo): dashboardInfo is DashboardInfo => dashboardInfo !== null),
      switchMap((dashboardInfo) =>
        this.dashboardsService.updateDashboardInfo(dashboardInfo).pipe(
          map(() => dashboardsListActions.updateCurrentDashboardInfoSuccess()),
          catchError((error) =>
            of(
              dashboardsListActions.updateCurrentDashboardInfoFailure({
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
      ofType(dashboardsListActions.deleteDashboard),
      switchMap(({ dashboardId }) =>
        this.dashboardsService.deleteDashboard(dashboardId).pipe(
          tap(() => this.roter.navigate([ROUTING_PATHS.DASHBOARD])),
          map(() => dashboardsListActions.deleteDashboardSuccess()),
          catchError((error) =>
            of(
              dashboardsListActions.deleteDashboardFailure({
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
