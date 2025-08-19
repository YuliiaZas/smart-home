import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TabInfo } from '@shared/models';
import { tabsActions } from './tabs.actions';

interface TabsState extends EntityState<TabInfo> {
  currentTabdId: string | null;
  tabsOrdered: string[];

  originalTabs: TabInfo[];
  originalTabsOrdered: string[];

  isChanged: boolean;
}

const tabsAdapter = createEntityAdapter<TabInfo>({
  selectId: (tab: TabInfo) => tab.id,
});

const initialState: TabsState = tabsAdapter.getInitialState({
  currentTabdId: null,
  tabsOrdered: [],

  originalTabs: [],
  originalTabsOrdered: [],

  isChanged: false,
});

// const getNewTab = (title: string, tabIds: string[]): DashboardTabInfo => ({
//   id: getUniqueId(getKebabCase(title), tabIds),
//   title,
//   cards: [],
// });

const reducer = createReducer<TabsState>(
  initialState,

  on(tabsActions.setCurrentTabId, (state, { tabId }) => ({ ...state, currentTabdId: tabId })),

  on(
    tabsActions.setTabsData,
    (state, { tabs }): TabsState =>
      tabsAdapter.setAll(
        tabs.map(({ id, title }) => ({ id, title })),
        {
          ...state,
          tabsOrdered: tabs.map((tab) => tab.id),
        }
      )
  ),

  on(
    tabsActions.enterEditMode,
    (state): TabsState => ({
      ...state,
      originalTabs: Object.values(state.entities).filter((entity): entity is TabInfo => !!entity),
      originalTabsOrdered: [...state.tabsOrdered],
    })
  ),
  on(
    tabsActions.exitEditMode,
    (state): TabsState => ({
      ...state,
      originalTabs: [],
      originalTabsOrdered: [],
      isChanged: false,
    })
  ),
  on(tabsActions.discardChanges, (state): TabsState => {
    if (!state.originalTabs) return state;
    return tabsAdapter.setAll(state.originalTabs, {
      ...state,
      tabsOrdered: [...state.originalTabsOrdered],
    });
  }),

  on(tabsActions.renameCurrentTab, (state, { title }): TabsState => {
    const currentTabId = state.currentTabdId;
    if (!currentTabId) return state;
    return tabsAdapter.updateOne({ id: currentTabId, changes: { title } }, { ...state, isChanged: true });
  }),

  on(tabsActions.reorderTabs, (state, { tabsOrdered }): TabsState => ({ ...state, tabsOrdered, isChanged: true })),

  on(tabsActions.addTab, (state, { tabInfo }): TabsState => {
    return tabsAdapter.addOne(tabInfo, {
      ...state,
      tabsOrdered: [...state.tabsOrdered, tabInfo.id],
      isChanged: true,
    });
  }),

  on(tabsActions.deleteCurrentTab, (state): TabsState => {
    const currentTabId = state.currentTabdId;
    if (!currentTabId) return state;
    return tabsAdapter.removeOne(currentTabId, {
      ...state,
      tabsOrdered: state.tabsOrdered.filter((id) => id !== currentTabId),
      isChanged: true,
    });
  })
);

export const tabsFeature = createFeature({
  name: 'tabs',
  reducer,
  extraSelectors: ({ selectEntities, selectTabsOrdered }) => ({
    selectOrderedTabs: createSelector(selectTabsOrdered, selectEntities, (tabsOrdered, entities) =>
      tabsOrdered.map((id) => entities[id]).filter((tab): tab is TabInfo => !!tab)
    ),
  }),
});
