import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardDataInfo, FailureAction } from '@shared/models';

export const currentDashboardActions = createActionGroup({
  source: 'Current Dashboard',
  events: {
    'Set Current Dashboard Id': props<{ dashboardId: string | null }>(),

    'Propagate Current Dashboard Data': props<{ dashboardData: DashboardDataInfo | null }>(),
    'Propagate Current Dashboard Data Success': emptyProps(),

    'Enter Edit Mode': emptyProps(),
    'Exit Edit Mode': emptyProps(),

    'Save Current Dashboard': emptyProps(),
    'Discard Changes': emptyProps(),

    'Start Updating Dashboard Data': props<{ dashboardId: string }>(),

    'Reset Current Dashboard': emptyProps(),
  },
});

export const currentDashboardApiActions = createActionGroup({
  source: 'Current Dashboard API',
  events: {
    'Load Dashboard Data': props<{ dashboardId: string | null }>(),
    'Load Dashboard Data Success': props<{ dashboardData: DashboardDataInfo | null }>(),
    'Load Dashboard Data Failure': props<{ action: FailureAction; error: Error }>(),

    'Update Dashboard Data': props<{ dashboardId: string; dashboardData: DashboardDataInfo }>(),
    'Update Dashboard Data Success': props<{ dashboardData: DashboardDataInfo | null }>(),
    'Update Dashboard Data Failure': props<{ action: FailureAction; error: Error }>(),
  },
});
