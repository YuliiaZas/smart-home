import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { TabInfo } from '@shared/models';
import { tabsFeature } from './tabs.state';
import { tabsActions } from './tabs.actions';

@Injectable({
  providedIn: 'root',
})
export class TabsFacade {
  #store = inject(Store);

  get tabsIds$(): Observable<string[]> {
    return this.#store.select(tabsFeature.selectTabsIdsOrdered);
  }

  get tabsEntities$(): Observable<Dictionary<TabInfo>> {
    return this.#store.select(tabsFeature.selectEntities);
  }

  get currentTabId$(): Observable<string | null> {
    return this.#store.select(tabsFeature.selectCurrentTabId);
  }

  get currentTabInfo$(): Observable<TabInfo | null> {
    return this.#store.select(tabsFeature.selectCurrentTab);
  }

  setCurrentTab(tabId: string): void {
    this.#store.dispatch(tabsActions.setCurrentTabId({ tabId }));
  }

  renameCurrentTab(title: string): void {
    this.#store.dispatch(tabsActions.renameCurrentTab({ title }));
  }

  reorderTabs(tabsIdsOrdered: string[]): void {
    this.#store.dispatch(tabsActions.reorderTabs({ tabsIdsOrdered }));
  }

  addTab(tabInfo: TabInfo): void {
    this.#store.dispatch(tabsActions.addTab({ tabInfo }));
  }

  deleteCurrentTab(): void {
    this.#store.dispatch(tabsActions.deleteCurrentTab());
  }
}
