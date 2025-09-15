import { ChangeDetectionStrategy, Component, inject, DestroyRef, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardList } from '@shared/components';
import { Entity } from '@shared/models';
import { executeWithDestroy } from '@shared/utils';
import { HomeTabService } from '@core/services';
import { HomeCard } from '../home-card/home-card';
import { HomeEmpty } from '../home-empty/home-empty';

@Component({
  selector: 'app-home-tab',
  imports: [MatIconModule, MatButtonModule, CardList, HomeCard, HomeEmpty],
  templateUrl: './home-tab.html',
  styleUrl: './home-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTab {
  #homeTabService = inject(HomeTabService);
  #destroyRef = inject(DestroyRef);

  cardEntity = Entity.CARD;

  cardsEntities = this.#homeTabService.cardsEntities;

  isEditMode = this.#homeTabService.isEditMode;
  currentEditCardId = this.#homeTabService.currentEditCardId;

  cardIds = this.#homeTabService.cardIds;

  constructor() {
    effect(() => {
      const currentEditCardId = this.currentEditCardId();
      if (currentEditCardId) this.editCurrentCard(currentEditCardId);
    });
  }

  addCard() {
    executeWithDestroy(this.#homeTabService.addCard(), this.#destroyRef);
  }

  editCurrentCard(currentCardId: string) {
    executeWithDestroy(this.#homeTabService.editCurrentCard(currentCardId), this.#destroyRef);
  }
}
