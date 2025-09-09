import { CardLayout } from './card-layout.enum';
import { HomeItemInfo } from './home-item-info';

export interface CardInfo {
  id: string;
  title: string;
  layout: CardLayout;
}

export interface HomeCardInfo extends CardInfo {
  items: HomeItemInfo[];
}

export interface HomeCardWithItemsIdsInfo extends CardInfo {
  itemIds: string[];
}
