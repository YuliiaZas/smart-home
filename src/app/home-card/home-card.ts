import { ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { HomeCardSingle } from './home-card-single/home-card-single';
import { HomeCardMultiple } from './home-card-multiple/home-card-multiple';
import { CardLayout, HomeCardInfo } from '@shared/models';

@Component({
  selector: 'app-home-card',
  imports: [HomeCardSingle, HomeCardMultiple],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCard {
  data = model.required<HomeCardInfo>();
  updateCardData = output<HomeCardInfo>();

  isSingleItem = computed<boolean>(() => this.data().layout === CardLayout.SINGLE && this.data().items.length === 1);
}
