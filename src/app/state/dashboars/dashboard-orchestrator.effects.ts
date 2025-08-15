import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { isString } from '@shared/utils';
import { DashboardDataInfo, HomeCardInfo, TabInfo } from '@shared/models';
import { tabsActions, tabsFeature } from '@state/tabs';
import { cardsActions, cardsFeature } from '@state/cards';
import { dashboardsListActions } from './dashboards-list';
import { currentDashboardActions, currentDashboardFeature, dashboardApiActions } from './current-dashboard';

@Injectable()
export class DashboardsOrchestratorEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);

  resetCurrentDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.resetCurrentDashboard),
      map(() => currentDashboardActions.setCurrentDashboardData({ dashboardData: null }))
    )
  );

  setCurrentDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.setCurrentDashboardData),
      switchMap(({ dashboardData }) => {
        const tabs = dashboardData?.tabs || [];
        return from([
          tabsActions.setTabsData({ tabs }),
          cardsActions.setCardsData({ tabs }),
          // devicesActions.setDevicesData({ tabs }),
        ]);
      })
    )
  );

  enterEditMode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.enterEditMode),
      switchMap(() => {
        return from([
          tabsActions.enterEditMode(),
          cardsActions.enterEditMode(),
          // devicesActions.enterEditMode(),
        ]);
      })
    )
  );

  exitEditMode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.exitEditMode),
      switchMap(() => {
        return from([
          tabsActions.exitEditMode(),
          cardsActions.exitEditMode(),
          // devicesActions.exitEditMode(),
        ]);
      })
    )
  );

  discardChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.discardChanges),
      switchMap(() => {
        return from([
          tabsActions.discardChanges(),
          cardsActions.discardChanges(),
          // devicesActions.discardChanges(),
          currentDashboardActions.exitEditMode(),
        ]);
      })
    )
  );

  saveCurrentDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentDashboardActions.saveCurrentDashboard),
      withLatestFrom(this.store.select(currentDashboardFeature.selectDashboardId)),
      map(([, currentDashboardId]) => currentDashboardId),
      filter((currentDashboardId) => isString(currentDashboardId)),
      withLatestFrom(
        this.store.select(tabsFeature.selectOrderedTabs),
        this.store.select(cardsFeature.selectCardsByTabs)
      ),
      map(([dashboardId, tabs, cardsByTabs]) => ({
        dashboardId,
        dashboardData: getherDashboardData(tabs, cardsByTabs),
      })),
      switchMap(({ dashboardId, dashboardData }) => {
        return from([
          dashboardApiActions.updateDashboardData({ dashboardId, dashboardData }),
          dashboardsListActions.updateCurrentDashboardInfo(),
        ]);
      })
    )
  );
}

function getherDashboardData(tabs: TabInfo[], cardsByTabs: Record<string, HomeCardInfo[]>): DashboardDataInfo {
  const tabsWithCards = tabs.map((tab) => ({
    ...tab,
    cards: cardsByTabs[tab.id] || [],
  }));
  return { tabs: tabsWithCards };
}
