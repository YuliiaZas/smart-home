import { DashboardTabInfo, DashboardTabWithItemsIds } from '@shared/models';

export interface DashboardData {
  tabs: DashboardTabInfo[];
}

export interface DashboardDataWithItemsIds {
  tabs: DashboardTabWithItemsIds[];
}
