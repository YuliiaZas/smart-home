import { inject, Injectable } from '@angular/core';
import { combineLatest, distinctUntilChanged, map, Observable, of, pairwise, switchMap, take } from 'rxjs';
import { DashboardInfo, FailureAction, LoadingStatus, StateError } from '@shared/models';
import { Store } from '@ngrx/store';
import { Auth } from '@core/auth';
import { cardsFeature } from '@state/cards';
import { tabsFeature } from '@state/tabs';
import { dashboardsListActions, dashboardsListApiActions, dashboardsListFeature } from './dashboards-list';
import { currentDashboardActions, currentDashboardFeature, currentDashboardApiActions } from './current-dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardsFacade {
  #store = inject(Store);
  #auth = inject(Auth);

  get userDashboards$(): Observable<DashboardInfo[]> {
    return this.#auth.isAuthenticated$.pipe(
      switchMap((isAuthenticated) => (isAuthenticated ? this.#store.select(dashboardsListFeature.selectAll) : of([])))
    );
  }

  get userDashboardIds$(): Observable<string[]> {
    return this.#store.select(dashboardsListFeature.selectIds).pipe(map((ids) => ids as string[]));
  }

  get userDashboardsShouldBeRefetched$(): Observable<boolean> {
    return this.#store.select(dashboardsListFeature.selectLoadingStatus).pipe(
      map((loadingStatus) => loadingStatus === LoadingStatus.NotUpdated),
      distinctUntilChanged()
    );
  }

  get areUserDashboardsLoaded$(): Observable<boolean> {
    return this.#store.select(dashboardsListFeature.selectLoadingStatus).pipe(
      map((loadingStatus) => loadingStatus === LoadingStatus.Success || loadingStatus === LoadingStatus.Failure),
      distinctUntilChanged()
    );
  }

  get isDashboardSaving$(): Observable<boolean> {
    return this.#store.select(currentDashboardFeature.selectLoadingStatus).pipe(
      pairwise(),
      map(
        ([previousStatus, currentStatus]) =>
          previousStatus === LoadingStatus.NotUpdated && currentStatus === LoadingStatus.Loading
      )
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
          this.#store.dispatch(currentDashboardApiActions.loadDashboardData({ dashboardId }));
        } else {
          this.#store.dispatch(currentDashboardActions.resetCurrentDashboard());
        }
      });
  }

  addDashboard(dashboardInfo: DashboardInfo): void {
    this.#store.dispatch(dashboardsListApiActions.addDashboard({ dashboardInfo }));
  }

  changeDashboardInfo(dashboardInfo: DashboardInfo): void {
    this.#store.dispatch(dashboardsListActions.changeDashboardInfo({ dashboardInfo }));
  }

  deleteDashboard(dashboardId: string): void {
    this.#store.dispatch(dashboardsListApiActions.deleteDashboard({ dashboardId }));
  }

  enterEditMode(): void {
    this.#store.dispatch(currentDashboardActions.enterEditMode());
  }

  exitEditMode(): void {
    this.#store.dispatch(currentDashboardActions.exitEditMode());
  }

  discardChanges(): void {
    this.#store.dispatch(currentDashboardActions.discardChanges());
  }

  saveCurrentDashboard(): void {
    this.#store.dispatch(currentDashboardActions.saveCurrentDashboard());
  }

  clearDashboardListError(): void {
    this.#store.dispatch(dashboardsListActions.clearError());
  }
}
