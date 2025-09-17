import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { FailureAction, LoadingStatus, StateError } from '@shared/models';
import { currentDashboardActions, currentDashboardApiActions } from './current-dashboard.actions';

interface CurrentDashboardState {
  isDashboardDataApplied: boolean;
  loadingStatus: LoadingStatus;
  dashboardId: string | null;
  isEditMode: boolean;
  error: { action: FailureAction; error: StateError['error'] } | null;
}

const initialState: CurrentDashboardState = {
  isDashboardDataApplied: false,
  loadingStatus: LoadingStatus.NotStarted,
  dashboardId: null,
  isEditMode: false,
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
    currentDashboardApiActions.loadDashboardData,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Loading,
      isDashboardDataApplied: false,
    })
  ),
  on(
    currentDashboardApiActions.loadDashboardDataSuccess,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Success,
      error: null,
    })
  ),
  on(
    currentDashboardApiActions.loadDashboardDataFailure,
    (state, errorInfo): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Failure,
      error: errorInfo,
    })
  ),
  on(
    currentDashboardActions.propagateCurrentDashboardDataSuccess,
    (state): CurrentDashboardState => ({
      ...state,
      isDashboardDataApplied: true,
    })
  ),

  on(currentDashboardActions.enterEditMode, (state): CurrentDashboardState => ({ ...state, isEditMode: true })),
  on(currentDashboardActions.exitEditMode, (state): CurrentDashboardState => ({ ...state, isEditMode: false })),

  on(
    currentDashboardActions.startUpdatingDashboard,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.NotUpdated,
    })
  ),
  on(
    currentDashboardApiActions.updateDashboard,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Loading,
      error: null,
    })
  ),
  on(
    currentDashboardApiActions.updateDashboardSuccess,
    (state): CurrentDashboardState => ({
      ...state,
      loadingStatus: LoadingStatus.Success,
      error: null,
    })
  ),
  on(
    currentDashboardApiActions.updateDashboardFailure,
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
