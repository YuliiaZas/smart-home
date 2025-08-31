import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { isString } from '@shared/utils';
import {
  DashboardDataInfo,
  DashboardTabInfo,
  HomeCardInfo,
  HomeCardWithItemsIdsInfo,
  HomeItemInfo,
  TabInfo,
} from '@shared/models';
import { tabsActions, tabsFeature } from '@state/tabs';
import { cardsActions, cardsFeature } from '@state/cards';
import { dashboardsListActions, dashboardsListApiActions, dashboardsListFeature } from './dashboards-list';
import { currentDashboardActions, currentDashboardFeature, dashboardApiActions } from './current-dashboard';
import { homeItemsActions, homeItemsFeature } from '@state/home-items';
import { Dictionary } from '@ngrx/entity';

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
      withLatestFrom(this.store.select(currentDashboardFeature.selectDashboardId)),
      map(([, currentDashboardId]) => currentDashboardId),
      filter((currentDashboardId) => isString(currentDashboardId)),
      withLatestFrom(
        this.store.select(dashboardsListFeature.selectEntities),
        this.store.select(tabsFeature.selectOrderedTabs),
        this.store.select(cardsFeature.selectCardsByTabs),
        this.store.select(homeItemsFeature.selectEntities)
      ),
      map(([dashboardId, dashboardInfoEntities, tabs, cardsByTabs, homeItemEntities]) => ({
        dashboardId,
        dashboardInfo: dashboardInfoEntities[dashboardId] || null,
        dashboardData: getherDashboardData(tabs, cardsByTabs, homeItemEntities),
      })),
      switchMap(({ dashboardId, dashboardInfo, dashboardData }) =>
        from([
          dashboardApiActions.updateDashboardData({ dashboardId, dashboardData }),
          dashboardsListApiActions.updateDashboardInfo({ dashboardInfo }),
        ])
      )
    )
  );
}

function getherDashboardData(
  tabs: TabInfo[],
  cardsByTabs: Record<string, HomeCardWithItemsIdsInfo[]>,
  homeItemEntities: Dictionary<HomeItemInfo>
): DashboardDataInfo {
  const tabsWithCards = tabs.map((tab) => ({
    ...tab,
    cards: getCardsForTab(tab.id, cardsByTabs, homeItemEntities),
  }));
  return { tabs: tabsWithCards };
}

function getCardsForTab(
  tabId: string,
  cardsByTabs: Record<string, HomeCardWithItemsIdsInfo[]>,
  homeItemEntities: Dictionary<HomeItemInfo>
): HomeCardInfo[] {
  const cardsIdsForTab = cardsByTabs[tabId];
  if (!cardsIdsForTab) return [];

  return cardsIdsForTab.map((card) => ({
    ...card,
    items: getHomeItemsByIds(homeItemEntities, card.items),
  }));
}

function getHomeItemsByIds(homeItemEntities: Dictionary<HomeItemInfo>, itemsIds: string[]): HomeItemInfo[] {
  if (!itemsIds) return [];

  return itemsIds.map((itemId) => homeItemEntities[itemId]).filter((item): item is HomeItemInfo => item !== undefined);
}
