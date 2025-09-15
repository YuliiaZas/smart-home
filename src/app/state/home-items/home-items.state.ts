import { FailureAction, HomeItemInfo, LoadingStatus, StateError } from '@shared/models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { homeItemsActions, homeItemsApiActions } from './home-items.actions';

interface HomeItemsState extends EntityState<HomeItemInfo> {
  allItemsLoadingStatus: LoadingStatus;
  error: { action: FailureAction; error: StateError['error'] } | null;
}

const homeItemsAdapter = createEntityAdapter<HomeItemInfo>({
  selectId: (homeItem: HomeItemInfo) => homeItem.id,
});

const initialState: HomeItemsState = homeItemsAdapter.getInitialState({
  allItemsLoadingStatus: LoadingStatus.NotStarted,
  error: null,
});

const reducer = createReducer<HomeItemsState>(
  initialState,
  on(homeItemsActions.setCurrentDashboardHomeItems, (state, { tabs }): HomeItemsState => {
    if (state.allItemsLoadingStatus === LoadingStatus.Success) {
      return state;
    }
    const homeItems = tabs.flatMap((tab) => tab.cards.flatMap((card) => card.items));
    return homeItemsAdapter.setAll(homeItems, initialState);
  }),

  on(homeItemsActions.loadAllHomeItems, (state): HomeItemsState => {
    if (state.allItemsLoadingStatus === initialState.allItemsLoadingStatus) {
      return { ...state, allItemsLoadingStatus: LoadingStatus.NotUpdated };
    }
    return state;
  }),
  on(
    homeItemsApiActions.loadAllHomeItems,
    (state): HomeItemsState => ({ ...state, allItemsLoadingStatus: LoadingStatus.Loading })
  ),
  on(homeItemsApiActions.loadAllHomeItemsSuccess, (state, { homeItems }): HomeItemsState => {
    const newState: HomeItemsState = {
      ...state,
      allItemsLoadingStatus: LoadingStatus.Success,
      error: null,
    };
    return homeItemsAdapter.setAll(homeItems, newState);
  }),
  on(
    homeItemsApiActions.loadAllHomeItemsFailure,
    (state, { action, error }): HomeItemsState => ({
      ...state,
      allItemsLoadingStatus: LoadingStatus.Failure,
      error: { action, error },
    })
  ),

  on(homeItemsApiActions.setDeviceState, (state, { deviceId, newState }): HomeItemsState => {
    return homeItemsAdapter.updateOne({ id: deviceId, changes: { state: newState } }, state);
  }),
  on(homeItemsApiActions.setDeviceStateFailure, (state, { deviceId, oldState, action, error }): HomeItemsState => {
    const newState: HomeItemsState = { ...state, error: { action, error } };
    return homeItemsAdapter.updateOne({ id: deviceId, changes: { state: oldState } }, newState);
  }),

  on(homeItemsApiActions.setStateForDevices, (state, { devicesIds, newState }): HomeItemsState => {
    const updates = devicesIds.map((deviceId) => ({ id: deviceId, changes: { state: newState } }));
    return homeItemsAdapter.updateMany(updates, state);
  }),
  on(
    homeItemsApiActions.setStateForDevicesFailure,
    (state, { devicesIds, oldState, action, error }): HomeItemsState => {
      const updates = devicesIds.map((deviceId) => ({ id: deviceId, changes: { state: oldState } }));
      const newState: HomeItemsState = { ...state, error: { action, error } };
      return homeItemsAdapter.updateMany(updates, newState);
    }
  ),

  on(homeItemsActions.resetHomeItems, (): HomeItemsState => initialState)
);

const { selectAll } = homeItemsAdapter.getSelectors();

export const homeItemsFeature = createFeature({
  name: 'homeItems',
  reducer,
  extraSelectors: ({ selectHomeItemsState }) => ({
    selectAll: createSelector(selectHomeItemsState, selectAll),
  }),
});
