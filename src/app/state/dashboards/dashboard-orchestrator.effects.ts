import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { DashboardInfo, DashboardTabInfo, LoadingStatus } from '@shared/models';
import { tabsActions, tabsFeature } from '@state/tabs';
import { cardsActions, cardsFeature } from '@state/cards';
import { dashboardsListActions, dashboardsListApiActions, dashboardsListFeature } from './dashboards-list';
import { currentDashboardActions, currentDashboardFeature, currentDashboardApiActions } from './current-dashboard';
import { homeItemsActions, homeItemsFeature } from '@state/home-items';
import { collectDashboardData } from '@shared/utils';

@Injectable()
export class DashboardsOrchestratorEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);

  resetCurrentDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.resetCurrentDashboard),
      map(() => currentDashboardActions.propagateCurrentDashboardData({ dashboardData: null }))
    )
  );

  setCurrentDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.propagateCurrentDashboardData),
      map(({ dashboardData }) => dashboardData?.tabs || ([] as DashboardTabInfo[])),
      switchMap((tabs) =>
        from([
          tabsActions.setTabsData({ tabs }),
          cardsActions.setCardsData({ tabs }),
          homeItemsActions.setCurrentDashboardHomeItems({ tabs }),
          currentDashboardActions.propagateCurrentDashboardDataSuccess(),
        ])
      )
    )
  );

  enterEditMode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.enterEditMode),
      withLatestFrom(this.store.select(currentDashboardFeature.selectDashboardId)),
      map(([, currentDashboardId]) => currentDashboardId),
      filter((dashboardId) => dashboardId !== null),
      switchMap((dashboardId) =>
        from([
          dashboardsListActions.enterEditMode({ dashboardId }),
          tabsActions.enterEditMode(),
          cardsActions.enterEditMode(),
        ])
      )
    )
  );

  exitEditMode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.exitEditMode),
      switchMap(() =>
        from([dashboardsListActions.exitEditMode(), tabsActions.exitEditMode(), cardsActions.exitEditMode()])
      )
    )
  );

  discardChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.discardChanges),
      switchMap(() =>
        from([
          dashboardsListActions.discardChangesForCurrentDashboardInfo(),
          tabsActions.discardChanges(),
          cardsActions.discardChanges(),
          currentDashboardActions.exitEditMode(),
        ])
      )
    )
  );

  saveCurrentDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.saveCurrentDashboard),
      withLatestFrom(
        this.store.select(currentDashboardFeature.selectDashboardId),
        this.store.select(dashboardsListFeature.selectIsChanged),
        this.store.select(tabsFeature.selectIsChanged),
        this.store.select(cardsFeature.selectIsChanged)
      ),
      switchMap(([, dashboardId, isDashboardInfoChanged, areTabsChanged, areCardsChanged]) => {
        const isDashboardDataChanged = areTabsChanged || areCardsChanged;

        if (!dashboardId || (!isDashboardInfoChanged && !isDashboardDataChanged)) {
          return of(currentDashboardActions.exitEditMode());
        }

        const actions: Action[] = [];
        if (isDashboardInfoChanged) {
          actions.push(dashboardsListActions.startUpdatingDashboardInfo({ dashboardId }));
        }
        if (isDashboardDataChanged) {
          actions.push(currentDashboardActions.startUpdatingDashboardData({ dashboardId }));
        }
        return actions;
      })
    )
  );

  startUpdatingDashboardInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListActions.startUpdatingDashboardInfo),
      withLatestFrom(this.store.select(dashboardsListFeature.selectEntities)),
      map(([{ dashboardId }, dashboardInfoEntities]) => dashboardInfoEntities[dashboardId] || null),
      filter((dashboardInfo: DashboardInfo | null) => dashboardInfo !== null),
      map((dashboardInfo) => dashboardsListApiActions.updateDashboardInfo({ dashboardInfo }))
    )
  );

  startUpdatingDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.startUpdatingDashboardData),
      withLatestFrom(
        this.store.select(tabsFeature.selectOrderedTabs),
        this.store.select(cardsFeature.selectCardsByTabs),
        this.store.select(homeItemsFeature.selectEntities)
      ),
      map(([{ dashboardId }, tabs, cardsByTabs, homeItemEntities]) => ({
        dashboardId,
        dashboardData: collectDashboardData(tabs, cardsByTabs, homeItemEntities),
      })),
      map(({ dashboardId, dashboardData }) =>
        currentDashboardApiActions.updateDashboardData({ dashboardId, dashboardData })
      )
    )
  );

  saveCurrentDashboardSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        dashboardsListApiActions.updateDashboardInfoSuccess,
        currentDashboardApiActions.updateDashboardDataSuccess
      ),
      withLatestFrom(
        this.store.select(dashboardsListFeature.selectLoadingStatus),
        this.store.select(currentDashboardFeature.selectLoadingStatus)
      ),
      filter(
        ([, dashboardsListLoadingStatus, currentDashboardLoadingStatus]) =>
          dashboardsListLoadingStatus === LoadingStatus.Success &&
          currentDashboardLoadingStatus === LoadingStatus.Success
      ),
      map(() => currentDashboardActions.exitEditMode())
    )
  );
}
