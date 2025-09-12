import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { DashboardInfo, EntityInfo } from '@shared/models';
import { TabInfoFormService, DashboardInfoFormService } from '@core/edit-entity';
import { DashboardsFacade, TabsFacade } from '@state';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  #dashboardsFacade = inject(DashboardsFacade);
  #tabsFacade = inject(TabsFacade);
  #dashboardInfoFormService = inject(DashboardInfoFormService);
  #tabInfoFormService = inject(TabInfoFormService);

  tabsIds = toSignal<string[]>(this.#tabsFacade.tabsIds$, { requireSync: true });
  tabsEntities = toSignal<Dictionary<EntityInfo>>(this.#tabsFacade.tabsEntities$, { requireSync: true });

  currentDashboardInfo = toSignal<DashboardInfo | null>(this.#dashboardsFacade.currentDashboardInfo$);
  #currentTabInfo = toSignal<EntityInfo | null>(this.#tabsFacade.currentTabInfo$);

  isEditMode = toSignal(this.#dashboardsFacade.isEditMode$);

  isDashboardSaving = toSignal(this.#dashboardsFacade.isDashboardSaving$);

  enterEditMode() {
    this.#dashboardsFacade.enterEditMode();
  }

  discardChanges() {
    this.#dashboardsFacade.discardChanges();
  }

  saveChanges() {
    this.#dashboardsFacade.saveCurrentDashboard();
  }

  renameCurrentDashboard(): Observable<void> {
    const currentDashboardInfo = this.currentDashboardInfo();
    if (!currentDashboardInfo) return EMPTY;

    return this.#dashboardInfoFormService.edit(currentDashboardInfo);
  }

  deleteCurrentDashboard() {
    const currentDashboardInfo = this.currentDashboardInfo();
    if (!currentDashboardInfo) return;

    this.#dashboardsFacade.deleteDashboard(currentDashboardInfo.id);
  }

  addTab(): Observable<void> {
    return this.#tabInfoFormService.addNew();
  }

  renameCurrentTab(): Observable<void> {
    const currentTabInfo = this.#currentTabInfo();
    if (!currentTabInfo) return EMPTY;

    return this.#tabInfoFormService.edit(currentTabInfo);
  }

  deleteCurrentTab() {
    this.#tabsFacade.deleteCurrentTab();
  }

  setTabSorting(sortedIds: string[]) {
    this.#tabsFacade.reorderTabs(sortedIds);
  }
}
