import { Dictionary } from '@ngrx/entity';
import { DashboardDataInfo, HomeCardInfo, HomeCardWithItemsIdsInfo, HomeItemInfo, TabInfo } from '@shared/models';

export function collectDashboardData(
  tabs: TabInfo[],
  cardsByTabs: Record<string, HomeCardWithItemsIdsInfo[]>,
  homeItemEntities: Dictionary<HomeItemInfo>
): DashboardDataInfo {
  const tabsWithCards = tabs.map((tab) => ({
    ...tab,
    cards: getCardsForTab(tab.id, cardsByTabs, homeItemEntities),
  }));
  return { tabs: tabsWithCards };
}

function getCardsForTab(
  tabId: string,
  cardsByTabs: Record<string, HomeCardWithItemsIdsInfo[]>,
  homeItemEntities: Dictionary<HomeItemInfo>
): HomeCardInfo[] {
  const cardsIdsForTab = cardsByTabs[tabId];
  if (!cardsIdsForTab) return [];

  return cardsIdsForTab.map((card) => ({
    ...card,
    items: getHomeItemsByIds(homeItemEntities, card.items),
  }));
}

function getHomeItemsByIds(homeItemEntities: Dictionary<HomeItemInfo>, itemsIds: string[]): HomeItemInfo[] {
  if (!itemsIds) return [];

  return itemsIds.map((itemId) => homeItemEntities[itemId]).filter((item): item is HomeItemInfo => item !== undefined);
}
