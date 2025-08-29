import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap, withLatestFrom } from 'rxjs';
import { tabsActions } from './tabs.actions';
import { Store } from '@ngrx/store';
import { tabsFeature } from './tabs.state';
import { Router } from '@angular/router';

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
        map(([tabId, currentTabId]) => {
          const currentBaseUrl = currentTabId ? getParentUrl(this.#router.url) : this.#router.url;
          return `${currentBaseUrl}/${tabId}`;
        }),
        tap((url) => this.#router.navigateByUrl(url))
      ),
    { dispatch: false }
  );

  deleteCurrentTab$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(tabsActions.deleteCurrentTab),
        withLatestFrom(this.#store.select(tabsFeature.selectTabsIdsOrdered)),
        map(([, tabsOrdered]) => {
          const defaultTabId = tabsOrdered[0] || null;
          const parentUrl = getParentUrl(this.#router.url);
          return defaultTabId ? `${parentUrl}/${defaultTabId}` : parentUrl;
        }),
        tap((url) => this.#router.navigateByUrl(url))
      ),
    { dispatch: false }
  );

  discardChanges$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(tabsActions.discardChanges),
        withLatestFrom(
          this.#store.select(tabsFeature.selectCurrentTabId),
          this.#store.select(tabsFeature.selectTabsIdsOrdered)
        ),
        map(([, currentTabId, tabsOrdered]) => currentTabId === null && tabsOrdered[0]),
        filter((defaultTabId) => !!defaultTabId),
        map((defaultTabId) => `${this.#router.url}/${defaultTabId}`),
        tap((url) => this.#router.navigateByUrl(url))
      ),
    { dispatch: false }
  );
}

function getParentUrl(url: string): string {
  return url.split('/').slice(0, -1).join('/');
}
