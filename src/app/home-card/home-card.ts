import { ChangeDetectionStrategy, Component, computed, inject, model, output } from '@angular/core';
import { HomeCardInfo } from '@shared/models';
import { HomeCardSingle } from './home-card-single/home-card-single';
import { HomeCardMultiple } from './home-card-multiple/home-card-multiple';
import { HomeCardService } from './home-card.service';

@Component({
  selector: 'app-home-card',
  imports: [HomeCardSingle, HomeCardMultiple],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCard {
  cardData = model.required<HomeCardInfo>();
  updateCardData = output<HomeCardInfo>();

  #cardService = inject(HomeCardService);

  isSingleItem = computed<boolean>(() => this.#cardService.getIsSingleItem(this.cardData()));
}
