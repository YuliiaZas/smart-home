import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { isEqual } from 'lodash';
import { DashboardInfo, FailureAction, LoadingStatus } from '@shared/models';
import { dashboardsListActions } from './dashboards-list.actions';

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
  on(dashboardsListActions.resetUserDashboards, (): DashboardsListState => initialState),

  on(
    dashboardsListActions.loadUserDashboards,
    (): DashboardsListState => ({ ...initialState, loadingStatus: LoadingStatus.Loading })
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
    dashboardsListActions.loadUserDashboardsFailure,
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

  on(
    dashboardsListActions.addDashboard,
    dashboardsListActions.updateCurrentDashboardInfo,
    dashboardsListActions.deleteDashboard,
    (state): DashboardsListState => ({ ...state, loadingStatus: LoadingStatus.Loading })
  ),
  on(
    dashboardsListActions.updateCurrentDashboardInfoSuccess,
    (state): DashboardsListState => ({
      ...state,
      changedCurrentDashboardInfo: null,
      loadingStatus: LoadingStatus.Success,
    })
  ),
  on(
    dashboardsListActions.addDashboardSuccess,
    dashboardsListActions.deleteDashboardSuccess,
    (state): DashboardsListState => ({
      ...state,
      loadingStatus: LoadingStatus.Success,
    })
  ),
  on(
    dashboardsListActions.addDashboardFailure,
    dashboardsListActions.updateCurrentDashboardInfoFailure,
    dashboardsListActions.deleteDashboardFailure,
    (state, errorInfo): DashboardsListState => ({
      ...state,
      loadingStatus: LoadingStatus.Failure,
      error: errorInfo,
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
