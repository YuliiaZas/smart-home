import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { EntityInfo } from '@shared/models';
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

  get tabsEntities$(): Observable<Dictionary<EntityInfo>> {
    return this.#store.select(tabsFeature.selectEntities);
  }

  get tabsTitles$(): Observable<string[]> {
    return this.#store.select(tabsFeature.selectTabsTitles);
  }

  get currentTabId$(): Observable<string | null> {
    return this.#store.select(tabsFeature.selectCurrentTabId);
  }

  get currentTabInfo$(): Observable<EntityInfo | null> {
    return this.#store.select(tabsFeature.selectCurrentTab);
  }

  setCurrentTab(tabId: string): void {
    this.#store.dispatch(tabsActions.setCurrentTabId({ tabId }));
  }

  renameTab(tabInfo: EntityInfo): void {
    this.#store.dispatch(tabsActions.renameTab({ tabInfo }));
  }

  reorderTabs(tabsIdsOrdered: string[]): void {
    this.#store.dispatch(tabsActions.reorderTabs({ tabsIdsOrdered }));
  }

  addTab(tabInfo: EntityInfo): void {
    this.#store.dispatch(tabsActions.addTab({ tabInfo }));
  }

  deleteCurrentTab(): void {
    this.#store.dispatch(tabsActions.deleteCurrentTab());
  }
}
