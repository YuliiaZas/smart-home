import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { FailureAction, LoadingStatus } from '@shared/models';
import { currentDashboardActions, dashboardApiActions } from './current-dashboard.actions';

interface CurrentDashboardState {
  dashboardDataLoadingStatus: LoadingStatus;
  dashboardId: string | null;
  error: { action: FailureAction; error: Error } | null;
}

const initialState: CurrentDashboardState = {
  dashboardDataLoadingStatus: LoadingStatus.NotStarted,
  dashboardId: null,
  error: null,
};

const reducer = createReducer<CurrentDashboardState>(
  initialState,
  on(
    currentDashboardActions.setCurrentDashboardId,
    (state, { dashboardId }): CurrentDashboardState => ({ ...state, dashboardId })
  ),
  on(currentDashboardActions.resetCurrentDashboard, (): CurrentDashboardState => initialState),
  on(
    dashboardApiActions.loadDashboardData,
    dashboardApiActions.updateDashboardData,
    (state): CurrentDashboardState => ({
      ...state,
      dashboardDataLoadingStatus: LoadingStatus.Loading,
    })
  ),
  on(
    currentDashboardActions.saveCurrentDashboard,
    (state): CurrentDashboardState => ({
      ...state,
      dashboardDataLoadingStatus: LoadingStatus.Loading,
    })
  ),
  on(
    dashboardApiActions.loadDashboardDataSuccess,
    dashboardApiActions.updateDashboardDataSuccess,
    (state): CurrentDashboardState => ({
      ...state,
      error: null,
      dashboardDataLoadingStatus: LoadingStatus.Success,
    })
  ),
  on(
    dashboardApiActions.loadDashboardDataFailure,
    dashboardApiActions.updateDashboardDataFailure,
    (state, errorInfo): CurrentDashboardState => ({
      ...state,
      error: errorInfo,
      dashboardDataLoadingStatus: LoadingStatus.Failure,
    })
  )
);

export const currentDashboardFeature = createFeature({
  name: 'currentDashboard',
  reducer,
  extraSelectors: ({ selectDashboardDataLoadingStatus }) => ({
    isLoading: createSelector(
      selectDashboardDataLoadingStatus,
      (loadingStatus) => loadingStatus === LoadingStatus.Loading
    ),
  }),
});
