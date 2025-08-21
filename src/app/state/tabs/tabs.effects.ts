import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs';
import { tabsActions } from './tabs.actions';
import { Store } from '@ngrx/store';
import { tabsFeature } from './tabs.state';
import { Router } from '@angular/router';

@Injectable()
export class TabsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #router = inject(Router);

  addTab$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(tabsActions.addTab),
      map(({ tabInfo }) => tabsActions.setCurrentTabId({ tabId: tabInfo.id }))
    )
  );

  deleteCurrentTab$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(tabsActions.deleteCurrentTab),
        withLatestFrom(this.#store.select(tabsFeature.selectTabsIdsOrdered)),
        map(([, tabsOrdered]) => {
          const parentPath = '..';
          const defaultTabId = tabsOrdered[0] || null;
          return defaultTabId ? [parentPath, defaultTabId] : [parentPath];
        }),
        tap((path) => this.#router.navigate(path))
      ),
    { dispatch: false }
  );
}
