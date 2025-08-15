import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { DashboardInfo, FailureAction, LoadingStatus } from '@shared/models';
import { dashboardsListActions } from './dashboards-list.actions';
import { isEqual } from 'lodash';

interface DashboardsListState extends EntityState<DashboardInfo> {
  loadingStatus: LoadingStatus;
  error: { action: FailureAction; error: Error } | null;
  changedCurrentDashboardInfo: DashboardInfo | null;
}

const dashboardsListAdapter = createEntityAdapter<DashboardInfo>({
  selectId: (dashboard: DashboardInfo) => dashboard.id,
});

const initialState: DashboardsListState = dashboardsListAdapter.getInitialState({
  loadingStatus: LoadingStatus.NotStarted,
  error: null,
  changedCurrentDashboardInfo: null,
});

const reducer = createReducer<DashboardsListState>(
  initialState,
  on(
    dashboardsListActions.loadUserDashboards,
    dashboardsListActions.addDashboard,
    dashboardsListActions.updateCurrentDashboardInfo,
    dashboardsListActions.deleteDashboard,
    (state): DashboardsListState => ({ ...state, loadingStatus: LoadingStatus.Loading })
  ),
  on(
    dashboardsListActions.loadUserDashboardsSuccess,
    (state, { dashboardsList }): DashboardsListState =>
      dashboardsListAdapter.setAll(dashboardsList, {
        ...state,
        loadingStatus: LoadingStatus.Success,
        error: null,
      })
  ),
  on(
    dashboardsListActions.updateCurrentDashboardInfoSuccess,
    (state): DashboardsListState => ({ ...state, changedCurrentDashboardInfo: null })
  ),
  on(
    dashboardsListActions.loadUserDashboardsFailure,
    dashboardsListActions.addDashboardFailure,
    dashboardsListActions.updateCurrentDashboardInfoFailure,
    dashboardsListActions.deleteDashboardFailure,
    (state, errorInfo): DashboardsListState => ({
      ...state,
      loadingStatus: LoadingStatus.Failure,
      error: errorInfo,
    })
  ),
  on(dashboardsListActions.changeCurrentDashboardInfo, (state, { dashboardInfo }): DashboardsListState => {
    const currentDashboardInfo = state.entities[dashboardInfo?.id || ''];
    const isUnchanged = isEqual(currentDashboardInfo, dashboardInfo);
    return { ...state, changedCurrentDashboardInfo: isUnchanged ? null : dashboardInfo };
  }),
  on(dashboardsListActions.resetUserDashboards, (): DashboardsListState => initialState)
);

const { selectAll } = dashboardsListAdapter.getSelectors();

export const dashboardsListFeature = createFeature({
  name: 'dashboardsList',
  reducer,
  extraSelectors: ({ selectLoadingStatus, selectDashboardsListState }) => ({
    isLoadingNotStarted: createSelector(
      selectLoadingStatus,
      (loadingStatus) => loadingStatus === LoadingStatus.NotStarted
    ),
    isLoading: createSelector(selectLoadingStatus, (loadingStatus) => loadingStatus === LoadingStatus.Loading),
    selectAll: createSelector(selectDashboardsListState, selectAll),
  }),
});
