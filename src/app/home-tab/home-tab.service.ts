import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { HomeCardWithItemsIdsInfo } from '@shared/models';
import { CardDataFormService, CardLayoutFormService } from '@shared/edit-entity';
import { TabsFacade, CardsFacade, DashboardsFacade, HomeItemsFacade } from '@state';

@Injectable({
  providedIn: 'root',
})
export class HomeTabService {
  #dashboardsFacade = inject(DashboardsFacade);
  #tabsFacade = inject(TabsFacade);
  #cardsFacade = inject(CardsFacade);
  #homeItemsFacade = inject(HomeItemsFacade);
  #cardLayoutFormService = inject(CardLayoutFormService);
  #cardDataFormService = inject(CardDataFormService);

  cardsEntities = toSignal(this.#cardsFacade.cardsEntities$, {
    initialValue: {} as Dictionary<HomeCardWithItemsIdsInfo>,
  });

  #tabId = toSignal(this.#tabsFacade.currentTabId$);
  #cardsOrderedByTab = toSignal(this.#cardsFacade.cardsOrderedByTab$, { initialValue: {} as Record<string, string[]> });

  isEditMode = toSignal(this.#dashboardsFacade.isEditMode$);
  currentEditCardId = toSignal(this.#cardsFacade.currentEditCardId$);

  cardIds = computed(() => {
    const tabId = this.#tabId();
    if (!tabId) return [];
    return this.#cardsOrderedByTab()[tabId] || [];
  });

  addCard(): Observable<void> {
    const tabId = this.#tabId();
    if (!tabId) return EMPTY;
    return this.#cardLayoutFormService.addNew(tabId);
  }

  editCurrentCard(currentCardId: string): Observable<void> {
    const cardData = this.cardsEntities()[currentCardId];
    if (!cardData) return EMPTY;

    this.#homeItemsFacade.loadAllHomeItems();

    return this.#cardDataFormService.edit(cardData);
  }
}
