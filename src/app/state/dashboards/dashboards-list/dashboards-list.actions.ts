import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardInfo, FailureAction } from '@shared/models';

export const dashboardsListActions = createActionGroup({
  source: 'Dashboards List',
  events: {
    'Load User Dashboards': emptyProps(),
    'Load User Dashboards Success': props<{ dashboardsList: DashboardInfo[] }>(),
    'Load User Dashboards Failure': props<{ action: FailureAction; error: Error }>(),

    'Add Dashboard': props<{ dashboardInfo: DashboardInfo }>(),
    'Add Dashboard Success': props<{ dashboardId: string }>(),
    'Add Dashboard Failure': props<{ action: FailureAction; error: Error }>(),

    'Update Current Dashboard Info': emptyProps(),
    'Update Current Dashboard Info Success': emptyProps(),
    'Update Current Dashboard Info Failure': props<{ action: FailureAction; error: Error }>(),

    'Delete Dashboard': props<{ dashboardId: string }>(),
    'Delete Dashboard Success': emptyProps(),
    'Delete Dashboard Failure': props<{ action: FailureAction; error: Error }>(),

    'Change Current Dashboard Info': props<{ dashboardInfo: DashboardInfo | null }>(),

    'Reset User Dashboards': emptyProps(),
  },
});
