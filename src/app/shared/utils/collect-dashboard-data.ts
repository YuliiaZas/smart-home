import { DashboardDataWithItemsIds, HomeCardWithItemsIdsInfo, EntityInfo } from '@shared/models';

export function collectDashboardData(
  tabs: EntityInfo[],
  cardsByTabs: Record<string, HomeCardWithItemsIdsInfo[]>
): DashboardDataWithItemsIds {
  const tabsWithCards = tabs.map((tab) => ({
    ...tab,
    cards: cardsByTabs[tab.id],
  }));
  return { tabs: tabsWithCards };
}
