import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { DashboardTab } from '@shared/models';
import { tabsActions, tabsFeature } from '@state/tabs';
import { cardsActions, cardsFeature } from '@state/cards';
import { dashboardsListActions, dashboardsListFeature } from './dashboards-list';
import { currentDashboardActions, currentDashboardFeature, currentDashboardApiActions } from './current-dashboard';
import { homeItemsActions } from '@state/home-items';
import { collectDashboardData } from '@shared/utils';

@Injectable()
export class DashboardsOrchestratorEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);

  resetUserDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardsListActions.resetUserDashboards),
      switchMap(() => from([currentDashboardActions.resetCurrentDashboard(), homeItemsActions.resetHomeItems()]))
    )
  );

  resetCurrentDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.resetCurrentDashboard),
      map(() => currentDashboardActions.propagateCurrentDashboardData({ dashboard: null }))
    )
  );

  setCurrentDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.propagateCurrentDashboardData),
      map(({ dashboard }) => dashboard?.tabs || ([] as DashboardTab[])),
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

  setCurrentDashboardId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.setCurrentDashboardId),
      map(() => tabsActions.setCurrentTabId({ tabId: null }))
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
      map(([, dashboardId, isDashboardInfoChanged, areTabsChanged, areCardsChanged]) => {
        const isDashboardDataChanged = areTabsChanged || areCardsChanged;

        if (!dashboardId || (!isDashboardInfoChanged && !isDashboardDataChanged)) {
          return currentDashboardActions.exitEditMode();
        }

        return currentDashboardActions.startUpdatingDashboard({
          dashboardId,
          updateInfo: isDashboardInfoChanged,
          updateData: isDashboardDataChanged,
        });
      })
    )
  );

  startUpdatingDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.startUpdatingDashboard),
      withLatestFrom(
        this.store.select(dashboardsListFeature.selectEntities),
        this.store.select(tabsFeature.selectOrderedTabs),
        this.store.select(cardsFeature.selectCardsByTabs)
      ),
      map(([{ dashboardId, updateInfo, updateData }, dashboardInfoEntities, tabs, cardsByTabs]) => ({
        dashboardId,
        dashboardInfo: updateInfo ? dashboardInfoEntities[dashboardId] || null : null,
        dashboardData: updateData ? collectDashboardData(tabs, cardsByTabs) : null,
      })),
      map(({ dashboardId, dashboardInfo, dashboardData }) =>
        currentDashboardApiActions.updateDashboard({ dashboardId, dashboardInfo, dashboardData })
      )
    )
  );

  updateDashboardDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardApiActions.updateDashboardSuccess),
      switchMap(({ dashboard }) =>
        from([
          currentDashboardActions.propagateCurrentDashboardData({ dashboard }),
          dashboardsListActions.propagateCurrentDashboardInfo({ dashboardInfo: dashboard }),
        ])
      )
    )
  );
}
