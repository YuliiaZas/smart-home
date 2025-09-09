import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { isEqual } from 'lodash';
import { EntityInfo } from '@shared/models';
import { tabsActions } from './tabs.actions';

interface TabsState extends EntityState<EntityInfo> {
  currentTabId: string | null;
  tabsIdsOrdered: string[];

  originalTabs: EntityInfo[];
  originalTabsIdsOrdered: string[];

  isChanged: boolean;
}

const tabsAdapter = createEntityAdapter<EntityInfo>({
  selectId: (tab: EntityInfo) => tab.id,
});

const initialState: TabsState = tabsAdapter.getInitialState({
  currentTabId: null,
  tabsIdsOrdered: [],

  originalTabs: [],
  originalTabsIdsOrdered: [],

  isChanged: false,
});

const reducer = createReducer<TabsState>(
  initialState,

  on(tabsActions.setCurrentTabId, (state, { tabId }): TabsState => ({ ...state, currentTabId: tabId })),

  on(tabsActions.setTabsData, (state, { tabs }): TabsState => {
    const newState: TabsState = {
      ...state,
      originalTabs: [],
      originalTabsIdsOrdered: [],
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
      originalTabs: Object.values(state.entities).filter((entity): entity is EntityInfo => !!entity),
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

  on(tabsActions.renameTab, (state, { tabInfo }): TabsState => {
    const currentTabId = state.currentTabId;
    if (currentTabId !== tabInfo.id) return state;
    const isChanged = !isEqual(state.entities[currentTabId], tabInfo);
    const newState: TabsState = { ...state, isChanged };
    if (!isChanged) return newState;
    return tabsAdapter.upsertOne(tabInfo, newState);
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
    const currentTabId = state.currentTabId;
    if (!currentTabId) return state;
    const newState: TabsState = {
      ...state,
      tabsIdsOrdered: state.tabsIdsOrdered.filter((id) => id !== currentTabId),
      currentTabId: null,
      isChanged: true,
    };
    return tabsAdapter.removeOne(currentTabId, newState);
  })
);

export const tabsFeature = createFeature({
  name: 'tabs',
  reducer,
  extraSelectors: ({ selectEntities, selectTabsIdsOrdered, selectCurrentTabId }) => ({
    selectOrderedTabs: createSelector(selectTabsIdsOrdered, selectEntities, (tabsIdsOrdered, entities) =>
      tabsIdsOrdered.map((id) => entities[id]).filter((tab): tab is EntityInfo => !!tab)
    ),
    selectCurrentTab: createSelector(selectEntities, selectCurrentTabId, (entities, currentTabId) =>
      currentTabId ? entities[currentTabId] || null : null
    ),
    selectTabsTitles: createSelector(selectTabsIdsOrdered, selectEntities, (ids, entities) =>
      ids.map((id) => entities[id]?.title).filter((title): title is string => !!title)
    ),
  }),
});
