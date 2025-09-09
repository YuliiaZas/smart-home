import { EntityInfo } from './entity-info';
import { HomeCardInfo, HomeCardWithItemsIdsInfo } from './home-card-info';

export interface DashboardTabInfo extends EntityInfo {
  cards: HomeCardInfo[];
}

export interface DashboardTabWithItemsIds extends EntityInfo {
  cards: HomeCardWithItemsIdsInfo[];
}
