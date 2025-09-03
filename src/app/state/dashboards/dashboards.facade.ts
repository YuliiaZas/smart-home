import { inject, Injectable } from '@angular/core';
import { combineLatest, distinctUntilChanged, EMPTY, map, Observable, switchMap, take } from 'rxjs';
import { DashboardInfo, FailureAction, LoadingStatus, StateError } from '@shared/models';
import { Store } from '@ngrx/store';
import { homeItemsActions } from '@state/home-items';
import { cardsFeature } from '@state/cards';
import { tabsFeature } from '@state/tabs';
import { dashboardsListActions, dashboardsListApiActions, dashboardsListFeature } from './dashboards-list';
import { currentDashboardActions, currentDashboardFeature, dashboardApiActions } from './current-dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardsFacade {
  #store = inject(Store);

  get userDashboards$(): Observable<DashboardInfo[]> {
    return this.#store.select(dashboardsListFeature.selectAll);
  }

  get userDashboardIds$(): Observable<string[]> {
    return this.#store.select(dashboardsListFeature.selectIds).pipe(map((ids) => ids as string[]));
  }

  get userDashboardsWithRequest$(): Observable<DashboardInfo[]> {
    return this.#store.select(dashboardsListFeature.selectLoadingStatus).pipe(
      switchMap((loadingStatus) => {
        if (loadingStatus === LoadingStatus.Success || loadingStatus === LoadingStatus.Failure) {
          return this.#store.select(dashboardsListFeature.selectAll);
        }
        if (loadingStatus === LoadingStatus.NotStarted || loadingStatus === LoadingStatus.NotUpdated) {
          this.#store.dispatch(dashboardsListApiActions.loadUserDashboards());
        }
        return EMPTY;
      })
    );
  }

  get userDashboardsShouldBeRefetched$(): Observable<boolean> {
    return this.#store.select(dashboardsListFeature.selectLoadingStatus).pipe(
      map((loadingStatus) => loadingStatus === LoadingStatus.NotUpdated),
      distinctUntilChanged()
    );
  }

  get addDashboardError$(): Observable<FailureAction | null> {
    return this.#store.select(dashboardsListFeature.selectError).pipe(
      map((error: StateError | null) => (error?.action === FailureAction.AddDashboard ? error.action : null)),
      distinctUntilChanged()
    );
  }

  get isCurrentDashboardLoaded$(): Observable<boolean> {
    return this.#store.select(currentDashboardFeature.selectIsDashboardDataApplied);
  }

  get currentDashboardInfo$(): Observable<DashboardInfo | null> {
    return combineLatest([
      this.#store.select(currentDashboardFeature.selectDashboardId),
      this.#store.select(dashboardsListFeature.selectEntities),
    ]).pipe(
      map(([currentDashboardId, dashboards]) => (currentDashboardId ? dashboards[currentDashboardId] || null : null))
    );
  }

  get isEditMode$(): Observable<boolean> {
    return this.#store.select(currentDashboardFeature.selectIsEditMode);
  }

  get isChangedState$(): Observable<boolean> {
    return combineLatest([
      this.#store.select(tabsFeature.selectIsChanged),
      this.#store.select(cardsFeature.selectIsChanged),
    ]).pipe(map(([isTabsChanged, isCardsChanged]) => isTabsChanged || isCardsChanged));
  }

  setCurrentDashboardId(dashboardId: string | null): void {
    this.#store
      .select(currentDashboardFeature.selectDashboardId)
      .pipe(take(1))
      .subscribe((currentId) => {
        if (currentId === dashboardId) return;

        this.#store.dispatch(currentDashboardActions.setCurrentDashboardId({ dashboardId }));
        if (dashboardId) {
          this.#store.dispatch(dashboardApiActions.loadDashboardData({ dashboardId }));
        } else {
          this.#store.dispatch(currentDashboardActions.resetCurrentDashboard());
        }
      });
  }

  addDashboard(dashboardInfo: DashboardInfo): void {
    this.#store.dispatch(dashboardsListApiActions.addDashboard({ dashboardInfo }));
  }

  editDashboardInfo(dashboardInfo: DashboardInfo): void {
    this.#store.dispatch(dashboardsListActions.changeDashboardInfo({ dashboardInfo }));
  }

  deleteDashboard(dashboardId: string): void {
    this.#store.dispatch(dashboardsListApiActions.deleteDashboard({ dashboardId }));
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

  clearDashboardListError(): void {
    this.#store.dispatch(dashboardsListActions.clearError());
  }
}
