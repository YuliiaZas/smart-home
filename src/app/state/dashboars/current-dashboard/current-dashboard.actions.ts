import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardDataInfo, FailureAction } from '@shared/models';

export const dashboardApiActions = createActionGroup({
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

export const currentDashboardActions = createActionGroup({
  source: 'Current Dashboard',
  events: {
    'Set Current Dashboard Id': props<{ dashboardId: string | null }>(),

    'Set Current Dashboard Data': props<{ dashboardData: DashboardDataInfo | null }>(),
    'Set Current Dashboard Data Success': emptyProps(),

    'Enter Edit Mode': emptyProps(),
    'Exit Edit Mode': emptyProps(),

    'Save Current Dashboard': emptyProps(),
    'Discard Changes': emptyProps(),

    'Reset Current Dashboard': emptyProps(),
  },
});
