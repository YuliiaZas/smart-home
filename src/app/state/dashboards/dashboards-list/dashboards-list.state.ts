import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { isEqual } from 'lodash';
import { DashboardInfo, LoadingStatus, StateError } from '@shared/models';
import { dashboardsListActions, dashboardsListApiActions } from './dashboards-list.actions';

interface DashboardsListState extends EntityState<DashboardInfo> {
  loadingStatus: LoadingStatus;
  error: StateError | null;

  originalCurrentDashboardInfo: DashboardInfo | null;
  isChanged: boolean;
}

const dashboardsListAdapter = createEntityAdapter<DashboardInfo>({
  selectId: (dashboard: DashboardInfo) => dashboard.id,
});

const initialState: DashboardsListState = dashboardsListAdapter.getInitialState({
  loadingStatus: LoadingStatus.NotStarted,
  error: null,
  originalCurrentDashboardInfo: null,
  isChanged: false,
});

const reducer = createReducer<DashboardsListState>(
  initialState,
  on(dashboardsListActions.resetUserDashboards, (): DashboardsListState => initialState),

  on(
    dashboardsListApiActions.loadUserDashboards,
    (): DashboardsListState => ({ ...initialState, loadingStatus: LoadingStatus.Loading })
  ),
  on(
    dashboardsListApiActions.loadUserDashboardsSuccess,
    (state, { dashboardsList }): DashboardsListState =>
      dashboardsListAdapter.setAll(dashboardsList, {
        ...state,
        loadingStatus: LoadingStatus.Success,
        error: null,
      })
  ),
  on(
    dashboardsListApiActions.loadUserDashboardsFailure,
    (state, errorInfo): DashboardsListState => ({
      ...state,
      loadingStatus: LoadingStatus.Failure,
      error: errorInfo,
    })
  ),

  on(dashboardsListActions.enterEditMode, (state, { dashboardId }): DashboardsListState => {
    return {
      ...state,
      originalCurrentDashboardInfo: state.entities[dashboardId] || null,
    };
  }),
  on(
    dashboardsListActions.exitEditMode,
    (state): DashboardsListState => ({
      ...state,
      originalCurrentDashboardInfo: null,
      isChanged: false,
    })
  ),

  on(dashboardsListActions.changeDashboardInfo, (state, { dashboardInfo }): DashboardsListState => {
    const isUnchanged = isEqual(state.originalCurrentDashboardInfo, dashboardInfo);
    if (isUnchanged) return state;
    const newState: DashboardsListState = {
      ...state,
      isChanged: true,
    };
    return dashboardsListAdapter.upsertOne(dashboardInfo, newState);
  }),
  on(dashboardsListActions.discardChangesForCurrentDashboardInfo, (state): DashboardsListState => {
    if (!state.originalCurrentDashboardInfo || !state.isChanged) return state;
    return dashboardsListAdapter.upsertOne(state.originalCurrentDashboardInfo, state);
  }),

  on(
    dashboardsListApiActions.addDashboard,
    dashboardsListApiActions.updateDashboardInfo,
    dashboardsListApiActions.deleteDashboard,
    (state): DashboardsListState => ({ ...state, loadingStatus: LoadingStatus.Loading })
  ),
  on(
    dashboardsListApiActions.updateDashboardInfoSuccess,
    (state): DashboardsListState => ({
      ...state,
      loadingStatus: LoadingStatus.Success,
    })
  ),
  on(
    dashboardsListApiActions.addDashboardSuccess,
    dashboardsListApiActions.deleteDashboardSuccess,
    (state): DashboardsListState => ({
      ...state,
      loadingStatus: LoadingStatus.NotUpdated,
    })
  ),
  on(
    dashboardsListApiActions.addDashboardFailure,
    dashboardsListApiActions.updateDashboardInfoFailure,
    dashboardsListApiActions.deleteDashboardFailure,
    (state, errorInfo): DashboardsListState => ({
      ...state,
      loadingStatus: LoadingStatus.Failure,
      error: errorInfo,
    })
  ),
  on(
    dashboardsListActions.clearError,
    (state): DashboardsListState => ({
      ...state,
      error: null,
    })
  )
);

const { selectAll } = dashboardsListAdapter.getSelectors();

export const dashboardsListFeature = createFeature({
  name: 'dashboardsList',
  reducer,
  extraSelectors: ({ selectDashboardsListState }) => ({
    selectAll: createSelector(selectDashboardsListState, selectAll),
  }),
});
