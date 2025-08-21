import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TabInfo } from '@shared/models';
import { tabsActions } from './tabs.actions';

interface TabsState extends EntityState<TabInfo> {
  currentTabdId: string | null;
  tabsIdsOrdered: string[];

  originalTabs: TabInfo[];
  originalTabsIdsOrdered: string[];

  isChanged: boolean;
}

const tabsAdapter = createEntityAdapter<TabInfo>({
  selectId: (tab: TabInfo) => tab.id,
});

const initialState: TabsState = tabsAdapter.getInitialState({
  currentTabdId: null,
  tabsIdsOrdered: [],

  originalTabs: [],
  originalTabsIdsOrdered: [],

  isChanged: false,
});

// const getNewTabInfo = (title: string, tabIds: string[]): TabInfo => ({
//   id: getUniqueId(getKebabCase(title), tabIds),
//   title,
// });

const reducer = createReducer<TabsState>(
  initialState,

  on(tabsActions.setCurrentTabId, (state, { tabId }) => ({ ...state, currentTabdId: tabId })),

  on(tabsActions.setTabsData, (_, { tabs }): TabsState => {
    const newState: TabsState = {
      ...initialState,
      tabsIdsOrdered: tabs.map((tab) => tab.id),
    };
    return tabsAdapter.setAll(
      tabs.map(({ id, title }) => ({ id, title })),
      newState
    );
  }),

  on(
    tabsActions.enterEditMode,
    (state): TabsState => ({
      ...state,
      originalTabs: Object.values(state.entities).filter((entity): entity is TabInfo => !!entity),
      originalTabsIdsOrdered: [...state.tabsIdsOrdered],
    })
  ),
  on(tabsActions.discardChanges, (state): TabsState => {
    if (!state.originalTabs) return state;
    const newState: TabsState = {
      ...state,
      tabsIdsOrdered: [...state.originalTabsIdsOrdered],
    };
    return tabsAdapter.setAll(state.originalTabs, newState);
  }),
  on(
    tabsActions.exitEditMode,
    (state): TabsState => ({
      ...state,
      originalTabs: [],
      originalTabsIdsOrdered: [],
      isChanged: false,
    })
  ),

  on(tabsActions.renameCurrentTab, (state, { title }): TabsState => {
    const currentTabId = state.currentTabdId;
    if (!currentTabId) return state;
    const newState: TabsState = { ...state, isChanged: true };
    return tabsAdapter.updateOne({ id: currentTabId, changes: { title } }, newState);
  }),

  on(
    tabsActions.reorderTabs,
    (state, { tabsIdsOrdered }): TabsState => ({ ...state, tabsIdsOrdered, isChanged: true })
  ),

  on(tabsActions.addTab, (state, { tabInfo }): TabsState => {
    const newState: TabsState = {
      ...state,
      tabsIdsOrdered: [...state.tabsIdsOrdered, tabInfo.id],
      isChanged: true,
    };
    return tabsAdapter.addOne(tabInfo, newState);
  }),

  on(tabsActions.deleteCurrentTab, (state): TabsState => {
    const currentTabId = state.currentTabdId;
    if (!currentTabId) return state;
    const newState: TabsState = {
      ...state,
      tabsIdsOrdered: state.tabsIdsOrdered.filter((id) => id !== currentTabId),
      isChanged: true,
    };
    return tabsAdapter.removeOne(currentTabId, newState);
  })
);

export const tabsFeature = createFeature({
  name: 'tabs',
  reducer,
  extraSelectors: ({ selectEntities, selectTabsIdsOrdered }) => ({
    selectOrderedTabs: createSelector(selectTabsIdsOrdered, selectEntities, (tabsIdsOrdered, entities) =>
      tabsIdsOrdered.map((id) => entities[id]).filter((tab): tab is TabInfo => !!tab)
    ),
  }),
});
