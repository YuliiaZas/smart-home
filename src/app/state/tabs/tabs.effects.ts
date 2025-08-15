import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs';
import { tabsActions } from './tabs.actions';
import { Store } from '@ngrx/store';
import { tabsFeature } from './tabs.state';

@Injectable()
export class TabsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  setOriginalTabsData$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(tabsActions.addTab),
      map(({ tabInfo }) => tabsActions.setCurrentTabId({ tabId: tabInfo.id }))
    )
  );

  deleteCurrentTab$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(tabsActions.deleteCurrentTab),
      withLatestFrom(this.#store.select(tabsFeature.selectTabsOrdered)),
      map(([, tabsOrdered]) => tabsActions.setCurrentTabId({ tabId: tabsOrdered[0] || null }))
    )
  );
}
