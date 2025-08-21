import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { FailureAction, LoadingStatus } from '@shared/models';
import { currentDashboardActions, dashboardApiActions } from './current-dashboard.actions';

interface CurrentDashboardState {
  isDashboardDataApplied: boolean;
  loadingStatus: LoadingStatus;
  dashboardId: string | null;
  error: { action: FailureAction; error: Error } | null;
}

const initialState: CurrentDashboardState = {
  isDashboardDataApplied: false,
  loadingStatus: LoadingStatus.NotStarted,
  dashboardId: null,
  error: null,
};

const reducer = createReducer<CurrentDashboardState>(
  initialState,
  on(currentDashboardActions.resetCurrentDashboard, (): CurrentDashboardState => initialState),

  on(
    currentDashboardActions.setCurrentDashboardId,
    (state, { dashboardId }): CurrentDashboardState => ({ ...state, dashboardId })
  ),

  on(
    dashboardApiActions.loadDashboardData,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Loading,
      isDashboardDataApplied: false,
    })
  ),
  on(
    dashboardApiActions.loadDashboardDataSuccess,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Success,
      error: null,
    })
  ),
  on(
    dashboardApiActions.loadDashboardDataFailure,
    (state, errorInfo): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Failure,
      error: errorInfo,
    })
  ),
  on(
    currentDashboardActions.setCurrentDashboardDataSuccess,
    (state): CurrentDashboardState => ({
      ...state,
      isDashboardDataApplied: true,
    })
  ),

  on(
    currentDashboardActions.saveCurrentDashboard,
    dashboardApiActions.updateDashboardData,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Loading,
    })
  ),
  on(
    dashboardApiActions.updateDashboardDataSuccess,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Success,
      error: null,
    })
  ),
  on(
    dashboardApiActions.updateDashboardDataFailure,
    (state, errorInfo): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Failure,
      error: errorInfo,
    })
  )
);

export const currentDashboardFeature = createFeature({
  name: 'currentDashboard',
  reducer,
  extraSelectors: ({ selectLoadingStatus }) => ({
    selectIsLoading: createSelector(selectLoadingStatus, (loadingStatus) => loadingStatus === LoadingStatus.Loading),
  }),
});
