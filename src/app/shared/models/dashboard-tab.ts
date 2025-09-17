import { EntityInfo } from './entity-info';
import { HomeCard, HomeCardWithItemsIdsInfo } from './home-card';

export interface DashboardTab extends EntityInfo {
  cards: HomeCard[];
}

export interface DashboardTabWithItemsIds extends EntityInfo {
  cards: HomeCardWithItemsIdsInfo[];
}
