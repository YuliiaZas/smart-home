import { FailureAction } from '@shared/models';

export const failureActionMessages = {
  [FailureAction.LoadUserDashboards]: 'Failed to load user dashboards',
  [FailureAction.LoadCurrentDashboard]: 'Failed to load current dashboard',
  [FailureAction.UpdateCurrentDashboardData]: 'Failed to update current dashboard data',
  [FailureAction.AddDashboard]: 'Failed to add new dashboard',
  [FailureAction.UpdateCurrentDashboardInfo]: 'Failed to rename current dashboard',
  [FailureAction.DeleteCurrentDashboard]: 'Failed to delete current dashboard',
};
