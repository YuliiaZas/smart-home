import { CardInfo } from './card-info';
import { HomeItemInfo } from './home-item-info';

export interface HomeCard extends CardInfo {
  items: HomeItemInfo[];
}

export interface HomeCardWithItemsIdsInfo extends CardInfo {
  itemIds: string[];
}
