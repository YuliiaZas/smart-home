import { inject, Injectable } from '@angular/core';
import { combineLatest, EMPTY, map, Observable, switchMap } from 'rxjs';
import { DashboardInfo } from '@shared/models';
import { Store } from '@ngrx/store';
import { homeItemsActions } from '@state/home-items';
import { cardsFeature } from '@state/cards';
import { tabsFeature } from '@state/tabs';
import { dashboardsListActions, dashboardsListFeature } from './dashboards-list';
import { currentDashboardActions, currentDashboardFeature } from './current-dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardsFacade {
  #store = inject(Store);

  get isUserDashboardsListLoading$(): Observable<boolean> {
    return this.#store.select(dashboardsListFeature.isLoading);
  }

  get userDashboards$(): Observable<DashboardInfo[]> {
    return this.#store.select(dashboardsListFeature.isLoadingNotStarted).pipe(
      switchMap((isLoadingNotStarted) => {
        if (isLoadingNotStarted) {
          this.#store.dispatch(dashboardsListActions.loadUserDashboards());
          return EMPTY;
        }
        return this.#store.select(dashboardsListFeature.selectAll);
      })
    );
  }

  get currentDashboardId$(): Observable<string | null> {
    return this.#store.select(currentDashboardFeature.selectDashboardId);
  }

  get currentDashboardInfo$(): Observable<DashboardInfo | null> {
    return combineLatest([
      this.#store.select(currentDashboardFeature.selectDashboardId),
      this.#store.select(dashboardsListFeature.selectEntities),
    ]).pipe(
      map(([currentDashboardId, dashboards]) => (currentDashboardId ? dashboards[currentDashboardId] || null : null))
    );
  }

  get isChangedState$(): Observable<boolean> {
    return combineLatest([
      this.#store.select(tabsFeature.selectIsChanged),
      this.#store.select(cardsFeature.selectIsChanged),
    ]).pipe(map(([isTabsChanged, isCardsChanged]) => isTabsChanged || isCardsChanged));
  }

  setCurrentDashboardId(dashboardId: string | null): void {
    this.#store.dispatch(currentDashboardActions.setCurrentDashboardId({ dashboardId }));
  }

  addDashboard(dashboardInfo: DashboardInfo): void {
    this.#store.dispatch(dashboardsListActions.addDashboard({ dashboardInfo }));
  }

  deleteDashboard(dashboardId: string): void {
    this.#store.dispatch(dashboardsListActions.deleteDashboard({ dashboardId }));
  }

  enterEditMode(): void {
    this.#store.dispatch(currentDashboardActions.enterEditMode());
  }

  discardChanges(): void {
    this.#store.dispatch(currentDashboardActions.discardChanges());
  }

  saveCurrentDashboard(): void {
    this.#store.dispatch(currentDashboardActions.saveCurrentDashboard());
  }

  resetDashboards(): void {
    this.#store.dispatch(dashboardsListActions.resetUserDashboards());
    this.#store.dispatch(currentDashboardActions.resetCurrentDashboard());
    this.#store.dispatch(homeItemsActions.resetHomeItems());
  }
}
