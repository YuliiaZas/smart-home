import { FailureAction, HomeItemInfo, LoadingStatus } from '@shared/models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { homeItemsActions, homeItemsApiActions } from './home-items.actions';

interface HomeItemsState extends EntityState<HomeItemInfo> {
  allItemsLoadingStatus: LoadingStatus;
  error: { action: FailureAction; error: Error } | null;
}

const cardsAdapter = createEntityAdapter<HomeItemInfo>({
  selectId: (homeItem: HomeItemInfo) => homeItem.id,
});

const initialState: HomeItemsState = cardsAdapter.getInitialState({
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
    return cardsAdapter.setAll(homeItems, state);
  }),

  on(
    homeItemsApiActions.loadAllHomeItems,
    (state): HomeItemsState => ({ ...state, allItemsLoadingStatus: LoadingStatus.Loading })
  ),
  on(
    homeItemsApiActions.loadAllHomeItemsSuccess,
    (state, { homeItems }): HomeItemsState => ({
      ...cardsAdapter.setAll(homeItems, state),
      allItemsLoadingStatus: LoadingStatus.Success,
      error: null,
    })
  ),
  on(
    homeItemsApiActions.loadAllHomeItemsFailure,
    (state, { action, error }): HomeItemsState => ({
      ...state,
      allItemsLoadingStatus: LoadingStatus.Failure,
      error: { action, error },
    })
  ),

  on(homeItemsApiActions.setDeviceState, (state, { deviceId, newState }): HomeItemsState => {
    return cardsAdapter.updateOne({ id: deviceId, changes: { state: newState } }, state);
  }),
  on(homeItemsApiActions.setDeviceStateFailure, (state, { deviceId, oldState, action, error }): HomeItemsState => {
    return cardsAdapter.updateOne(
      { id: deviceId, changes: { state: oldState } },
      { ...state, error: { action, error } }
    );
  }),

  on(homeItemsApiActions.setStateForDevices, (state, { devicesIds, newState }): HomeItemsState => {
    const updates = devicesIds.map((deviceId) => ({ id: deviceId, changes: { state: newState } }));
    return cardsAdapter.updateMany(updates, state);
  }),
  on(
    homeItemsApiActions.setStateForDevicesFailure,
    (state, { devicesIds, oldState, action, error }): HomeItemsState => {
      const updates = devicesIds.map((deviceId) => ({ id: deviceId, changes: { state: oldState } }));
      return cardsAdapter.updateMany(updates, { ...state, error: { action, error } });
    }
  ),

  on(homeItemsActions.resetHomeItems, (): HomeItemsState => initialState)
);

const { selectAll } = cardsAdapter.getSelectors();

export const homeItemsFeature = createFeature({
  name: 'homeItems',
  reducer,
  extraSelectors: ({ selectAllItemsLoadingStatus, selectHomeItemsState }) => ({
    selectAreAllItemsLoading: createSelector(
      selectAllItemsLoadingStatus,
      (loadingStatus) => loadingStatus === LoadingStatus.Loading
    ),
    selectAll: createSelector(selectHomeItemsState, selectAll),
  }),
});
