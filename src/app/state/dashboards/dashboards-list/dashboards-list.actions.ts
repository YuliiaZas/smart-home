import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardInfo, FailureAction, StateError } from '@shared/models';

export const dashboardsListActions = createActionGroup({
  source: 'Dashboards List',
  events: {
    'Enter Edit Mode': props<{ dashboardId: string }>(),
    'Exit Edit Mode': emptyProps(),

    'Change Dashboard Info': props<{ dashboardInfo: DashboardInfo }>(),
    'Discard Changes For Current Dashboard Info': emptyProps(),

    'Propagate Current Dashboard Info': props<{ dashboardInfo: DashboardInfo | null }>(),

    'Reset User Dashboards': emptyProps(),

    'Clear Error': emptyProps(),
  },
});

export const dashboardsListApiActions = createActionGroup({
  source: 'Dashboards List API',
  events: {
    'Load User Dashboards': emptyProps(),
    'Load User Dashboards Success': props<{ dashboardsList: DashboardInfo[] }>(),
    'Load User Dashboards Failure': props<{ action: FailureAction; error: StateError['error'] }>(),

    'Add Dashboard': props<{ dashboardInfo: DashboardInfo }>(),
    'Add Dashboard Success': props<{ dashboardId: string }>(),
    'Add Dashboard Failure': props<{ action: FailureAction; data: DashboardInfo; error: StateError['error'] }>(),

    'Delete Dashboard': props<{ dashboardId: string }>(),
    'Delete Dashboard Success': emptyProps(),
    'Delete Dashboard Failure': props<{ action: FailureAction; error: StateError['error'] }>(),
  },
});
