import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs';
import { createUrlRelatedToCurrentUrl } from '@shared/utils';
import { tabsActions } from './tabs.actions';
import { tabsFeature } from './tabs.state';

@Injectable()
export class TabsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #router = inject(Router);

  addTab$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(tabsActions.addTab),
        map(({ tabInfo }) => tabInfo.id),
        withLatestFrom(this.#store.select(tabsFeature.selectCurrentTabId)),
        map(([tabId, currentTabId]) => createUrlRelatedToCurrentUrl(tabId, this.#router.url, !!currentTabId)),
        tap((url) => this.#router.navigateByUrl(url))
      ),
    { dispatch: false }
  );

  deleteCurrentTab$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(tabsActions.deleteCurrentTab),
        withLatestFrom(this.#store.select(tabsFeature.selectTabsIdsOrdered)),
        map(([, tabsOrdered]) => createUrlRelatedToCurrentUrl(tabsOrdered[0] || '', this.#router.url, true)),
        tap((url) => this.#router.navigateByUrl(url))
      ),
    { dispatch: false }
  );

  discardChanges$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(tabsActions.discardChanges),
        withLatestFrom(
          this.#store.select(tabsFeature.selectTabsIdsOrdered),
          this.#store.select(tabsFeature.selectCurrentTabId)
        ),
        filter(([, tabsOrdered, currentTabId]) => currentTabId === null || !tabsOrdered.includes(currentTabId)),
        map(([, tabsOrdered, currentTabId]) => ({ defaultTabId: tabsOrdered[0], isCurrentTabId: !!currentTabId })),
        filter(({ defaultTabId }) => defaultTabId !== undefined),
        map(({ defaultTabId, isCurrentTabId }) =>
          createUrlRelatedToCurrentUrl(defaultTabId, this.#router.url, isCurrentTabId)
        ),
        tap((url) => this.#router.navigateByUrl(url))
      ),
    { dispatch: false }
  );
}
