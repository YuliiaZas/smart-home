import { ChangeDetectionStrategy, Component, inject, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardList } from '@shared/components';
import { Entity } from '@shared/models';
import { HomeCard } from '../home-card/home-card';
import { HomeEmpty } from '../home-empty/home-empty';
import { HomeTabService } from './home-tab.service';

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
    this.#homeTabService.addCard().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe();
  }

  editCurrentCard(currentCardId: string) {
    this.#homeTabService.editCurrentCard(currentCardId).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe();
  }
}
