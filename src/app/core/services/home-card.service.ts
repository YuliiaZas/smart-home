import { Injectable } from '@angular/core';
import { IconPositionInfo } from '@shared/directives';
import { CardLayout, HomeCardWithItemsIdsInfo } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class HomeCardService {
  getIsSingleItem(cardData: HomeCardWithItemsIdsInfo): boolean {
    return cardData.layout === CardLayout.SINGLE && cardData.itemIds.length === 1;
  }

  getIsContentVertical(cardData: HomeCardWithItemsIdsInfo): boolean {
    return cardData.layout === CardLayout.VERTICAL;
  }

  getIconPosition(isContentVertical: boolean): IconPositionInfo {
    return isContentVertical ? 'bottom' : 'left';
  }
}
