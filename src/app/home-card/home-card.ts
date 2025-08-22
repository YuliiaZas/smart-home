import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model, viewChild } from '@angular/core';
import { CardLayout, HomeCardWithItemsIdsInfo } from '@shared/models';
import { Card, Mover } from '@shared/components';
import { HomeCardSingle } from './home-card-single/home-card-single';
import { HomeCardMultiple } from './home-card-multiple/home-card-multiple';

@Component({
  selector: 'app-home-card',
  imports: [NgTemplateOutlet, Card, Mover, HomeCardSingle, HomeCardMultiple],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCard {
  cardData = model.required<HomeCardWithItemsIdsInfo>();
  sortedIds = input.required<string[]>();

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
}
