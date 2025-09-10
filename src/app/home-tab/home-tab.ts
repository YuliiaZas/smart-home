import { ChangeDetectionStrategy, Component, inject, computed, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Dictionary } from '@ngrx/entity';
import { CardList } from '@shared/components';
import { CardInfo, Entity, HomeCardWithItemsIdsInfo } from '@shared/models';
import { TabsFacade, CardsFacade, DashboardsFacade, HomeItemsFacade } from '@state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeCard } from '../home-card/home-card';
import { HomeEmpty } from '../home-empty/home-empty';
import { CardDataFormService, CardLayoutFormService } from '@core/edit-entity';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home-tab',
  imports: [MatIconModule, MatButtonModule, CardList, HomeCard, HomeEmpty],
  templateUrl: './home-tab.html',
  styleUrl: './home-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTab {
  #dashboardsFacade = inject(DashboardsFacade);
  #tabsFacade = inject(TabsFacade);
  #cardsFacade = inject(CardsFacade);
  #homeItemsFacade = inject(HomeItemsFacade);
  #cardLayoutFormService = inject(CardLayoutFormService);
  #cardDataFormService = inject(CardDataFormService);
  #destroyRef = inject(DestroyRef);

  cardEntity = Entity.CARD;

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

  constructor() {
    effect(() => {
      const currentEditCardId = this.currentEditCardId();
      if (currentEditCardId) this.editCurrentCard(currentEditCardId);
    });
  }

  addCard() {
    const tabId = this.#tabId();
    if (!tabId) return;
    this.#cardLayoutFormService
      .addNew(tabId)
      .pipe(
        filter((cardInfo) => cardInfo !== null),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((cardInfo: Pick<CardInfo, 'id' | 'layout'>) => {
        this.#cardsFacade.addCard(tabId, cardInfo);
      });
  }

  editCurrentCard(currentCardId: string) {
    const cardData = this.cardsEntities()[currentCardId];
    if (!cardData) return;

    this.#homeItemsFacade.loadAllHomeItems();

    this.#cardDataFormService
      .edit(cardData)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((cardData: Omit<HomeCardWithItemsIdsInfo, 'layout'> | null) => {
        if (cardData) {
          this.#cardsFacade.changeCurrentCard(cardData);
        } else {
          this.#cardsFacade.discardCurrentCardChanges();
        }
      });
  }
}
