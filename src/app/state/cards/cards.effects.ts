import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { cardsActions } from './cards.actions';

@Injectable()
export class CardsEffects {
  private actions$ = inject(Actions);

  setOriginalTabsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cardsActions.addCard),
      map(({ cardInfo }) => cardsActions.enterCardEditMode({ cardId: cardInfo.id }))
    )
  );
}
