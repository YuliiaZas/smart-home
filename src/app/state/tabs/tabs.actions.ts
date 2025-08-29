import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardTabInfo, TabInfo } from '@shared/models';

export const tabsActions = createActionGroup({
  source: 'Tabs',
  events: {
    'Set Tabs Data': props<{ tabs: DashboardTabInfo[] }>(),

    'Enter Edit Mode': emptyProps(),
    'Exit Edit Mode': emptyProps(),
    'Discard Changes': emptyProps(),

    'Set Current Tab Id': props<{ tabId: string | null }>(),

    'Rename Tab': props<{ tabInfo: TabInfo }>(),

    'Reorder Tabs': props<{ tabsIdsOrdered: string[] }>(),

    'Add Tab': props<{ tabInfo: TabInfo }>(),

    'Delete Current Tab': emptyProps(),
  },
});
