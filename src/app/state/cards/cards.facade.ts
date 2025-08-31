import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CardInfo, HomeCardWithItemsIdsInfo } from '@shared/models';
import { cardsFeature } from './cards.state';
import { cardsActions } from './cards.actions';

@Injectable({
  providedIn: 'root',
})
export class CardsFacade {
  #store = inject(Store);

  get cardsOrderedByTab$(): Observable<Record<string, string[]>> {
    return this.#store.select(cardsFeature.selectCardsOrderedByTab);
  }

  get cardsEntities$(): Observable<Dictionary<HomeCardWithItemsIdsInfo>> {
    return this.#store.select(cardsFeature.selectEntities);
  }

  get currentEditCardId$(): Observable<string | null> {
    return this.#store.select(cardsFeature.selectCurrentCardId);
  }

  enterCardEditMode(cardId: string): void {
    this.#store.dispatch(cardsActions.enterCardEditMode({ cardId }));
  }

  renameCurrentCard(title: string): void {
    this.#store.dispatch(cardsActions.renameCurrentCard({ title }));
  }

  addItemToCurrentCard(itemId: string): void {
    this.#store.dispatch(cardsActions.addItemToCurrentCard({ itemId }));
  }

  removeItemFromCurrentCard(orderIndex: number): void {
    this.#store.dispatch(cardsActions.removeItemFromCurrentCard({ orderIndex }));
  }

  saveCurrentCardChanges(): void {
    this.#store.dispatch(cardsActions.saveCurrentCardChanges());
  }

  discardCurrentCardChanges(): void {
    this.#store.dispatch(cardsActions.discardCurrentCardChanges());
  }

  reorderCards(tabId: string, cardsIdsOrdered: string[]): void {
    this.#store.dispatch(cardsActions.reorderCards({ tabId, cardsIdsOrdered }));
  }

  addCard(tabId: string, cardInfo: CardInfo): void {
    this.#store.dispatch(cardsActions.addCard({ tabId, cardInfo }));
  }

  deleteCard(tabId: string, cardId: string): void {
    this.#store.dispatch(cardsActions.deleteCard({ tabId, cardId }));
  }
}
