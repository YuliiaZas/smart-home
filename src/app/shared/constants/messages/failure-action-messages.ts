import { FailureAction } from '@shared/models';

export const failureActionMessages: Record<FailureAction, string> = {
  [FailureAction.LoadUserDashboards]: 'Failed to load user dashboards',
  [FailureAction.LoadCurrentDashboard]: 'Failed to load current dashboard',
  [FailureAction.UpdateCurrentDashboardData]: 'Failed to update current dashboard data',
  [FailureAction.AddDashboard]: 'Failed to add new dashboard. Please, try one more time',
  [FailureAction.UpdateCurrentDashboardInfo]: 'Failed to rename current dashboard',
  [FailureAction.DeleteCurrentDashboard]: 'Failed to delete current dashboard',
  [FailureAction.LoadAllHomeItems]: 'Failed to load all available devices and sensors',
  [FailureAction.ChangeDeviceState]: 'Failed to change status of the device',
  [FailureAction.ChangeDevicesState]: 'Failed to change status of some devices',
};
