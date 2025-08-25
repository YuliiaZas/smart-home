import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardLayout, Entity, HomeCardWithItemsIdsInfo } from '@shared/models';
import { Card, EditActionButtons, Mover } from '@shared/components';
import { CardsFacade, DashboardsFacade, TabsFacade } from '@state';
import { HomeCardSingle } from './home-card-single/home-card-single';
import { HomeCardMultiple } from './home-card-multiple/home-card-multiple';

@Component({
  selector: 'app-home-card',
  imports: [NgTemplateOutlet, Card, Mover, HomeCardSingle, HomeCardMultiple, EditActionButtons],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCard {
  #dashboardsFacade = inject(DashboardsFacade);
  #tabsFacade = inject(TabsFacade);
  #cardsFacade = inject(CardsFacade);

  entity = Entity.CARD;

  cardData = input.required<HomeCardWithItemsIdsInfo>();
  sortedIds = input.required<string[]>();

  isEditMode = toSignal(this.#dashboardsFacade.isEditMode$);
  #tabId = toSignal(this.#tabsFacade.currentTabId$);

  singleCardContent = viewChild(HomeCardSingle);
  multipleCardContent = viewChild(HomeCardMultiple);

  titleTemplate = computed(
    () => this.singleCardContent()?.cardTitleTemplate() ?? this.multipleCardContent()?.cardTitleTemplate()
  );
  actionTemplate = computed(
    () => this.singleCardContent()?.cardActionTemplate() ?? this.multipleCardContent()?.cardActionTemplate()
  );

  isSingleItem = computed<boolean>(
    () => this.cardData().layout === CardLayout.SINGLE && this.cardData().items.length === 1
  );

  enterCardEditMode() {
    this.#cardsFacade.enterCardEditMode(this.cardData().id);
  }

  deleteCurrentCard() {
    const currentTabId = this.#tabId();
    if (currentTabId) {
      this.#cardsFacade.deleteCard(currentTabId, this.cardData().id);
    }
  }

  setCardsSorting(newSorting: string[]) {
    const currentTabId = this.#tabId();
    if (currentTabId) {
      this.#cardsFacade.reorderCards(currentTabId, newSorting);
    }
  }
}
