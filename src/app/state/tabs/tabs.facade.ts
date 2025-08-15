import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TabInfo } from '@shared/models';
import { tabsFeature } from './tabs.state';
import { tabsActions } from './tabs.actions';

@Injectable({
  providedIn: 'root',
})
export class TabsFacade {
  #store = inject(Store);

  get tabInfo$(): Observable<TabInfo[]> {
    return this.#store.select(tabsFeature.selectOrderedTabs);
  }

  get currentTabId$(): Observable<string | null> {
    return this.#store.select(tabsFeature.selectCurrentTabdId);
  }

  enterCardEditMode(tabId: string): void {
    this.#store.dispatch(tabsActions.setCurrentTabId({ tabId }));
  }

  renameCurrentTab(title: string): void {
    this.#store.dispatch(tabsActions.renameCurrentTab({ title }));
  }

  reorderTabs(tabId: string, tabsOrdered: string[]): void {
    this.#store.dispatch(tabsActions.reorderTabs({ tabsOrdered }));
  }

  addTab(tabInfo: TabInfo): void {
    this.#store.dispatch(tabsActions.addTab({ tabInfo }));
  }

  deleteCurrentTab(): void {
    this.#store.dispatch(tabsActions.deleteCurrentTab());
  }
}
