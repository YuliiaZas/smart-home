import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { HomeCardSingle } from './home-card-single/home-card-single';
import { HomeCardMultiple } from './home-card-multiple/home-card-multiple';
import { CardLayout, HomeCardWithItemsIdsInfo } from '@shared/models';

@Component({
  selector: 'app-home-card',
  imports: [HomeCardSingle, HomeCardMultiple],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCard {
  cardData = model.required<HomeCardWithItemsIdsInfo>();
  // updateCardData = output<HomeCardInfo>();

  isSingleItem = computed<boolean>(
    () => this.cardData().layout === CardLayout.SINGLE && this.cardData().items.length === 1
  );
}
