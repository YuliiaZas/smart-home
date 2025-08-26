import { Entity } from './../shared/models/entity.enum';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Dictionary } from '@ngrx/entity';
import { CardList } from '@shared/components';
import { HomeCardWithItemsIdsInfo } from '@shared/models';
import { TabsFacade, CardsFacade } from '@state';
import { HomeCard } from '../home-card/home-card';
import { HomeEmpty } from '../home-empty/home-empty';

@Component({
  selector: 'app-home-tab',
  imports: [CardList, HomeCard, HomeEmpty],
  templateUrl: './home-tab.html',
  styleUrl: './home-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTab {
  #tabsFacade = inject(TabsFacade);
  #cardsFacade = inject(CardsFacade);

  cardEntity = Entity.CARD;

  cardsEntities = toSignal(this.#cardsFacade.cardsEntities$, {
    initialValue: {} as Dictionary<HomeCardWithItemsIdsInfo>,
  });

  #tabId = toSignal(this.#tabsFacade.currentTabId$);
  #cardsOrderedByTab = toSignal(this.#cardsFacade.cardsOrderedByTab$, { initialValue: {} as Record<string, string[]> });

  cardIds = computed(() => {
    const tabId = this.#tabId();
    if (!tabId) return [];
    return this.#cardsOrderedByTab()[tabId];
  });
}
