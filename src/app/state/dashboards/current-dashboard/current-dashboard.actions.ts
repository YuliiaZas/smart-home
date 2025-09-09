import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  DashboardData,
  DashboardDataInfo,
  DashboardDataWithItemsIds,
  DashboardInfo,
  FailureAction,
} from '@shared/models';

export const currentDashboardActions = createActionGroup({
  source: 'Current Dashboard',
  events: {
    'Set Current Dashboard Id': props<{ dashboardId: string | null }>(),

    'Propagate Current Dashboard Data': props<{ dashboard: DashboardData | null }>(),
    'Propagate Current Dashboard Data Success': emptyProps(),

    'Enter Edit Mode': emptyProps(),
    'Exit Edit Mode': emptyProps(),

    'Save Current Dashboard': emptyProps(),
    'Discard Changes': emptyProps(),

    'Start Updating Dashboard': props<{ dashboardId: string; updateInfo: boolean; updateData: boolean }>(),

    'Reset Current Dashboard': emptyProps(),
  },
});

export const currentDashboardApiActions = createActionGroup({
  source: 'Current Dashboard API',
  events: {
    'Load Dashboard Data': props<{ dashboardId: string | null }>(),
    'Load Dashboard Data Success': props<{ dashboard: DashboardDataInfo | null }>(),
    'Load Dashboard Data Failure': props<{ action: FailureAction; error: Error }>(),

    'Update Dashboard': props<{
      dashboardId: string;
      dashboardInfo: DashboardInfo | null;
      dashboardData: DashboardDataWithItemsIds | null;
    }>(),
    'Update Dashboard Success': props<{ dashboard: DashboardDataInfo | null }>(),
    'Update Dashboard Failure': props<{ action: FailureAction; error: Error }>(),
  },
});
