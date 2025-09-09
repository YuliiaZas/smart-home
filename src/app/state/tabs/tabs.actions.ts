import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardTabInfo, EntityInfo } from '@shared/models';

export const tabsActions = createActionGroup({
  source: 'Tabs',
  events: {
    'Set Tabs Data': props<{ tabs: DashboardTabInfo[] }>(),

    'Enter Edit Mode': emptyProps(),
    'Exit Edit Mode': emptyProps(),
    'Discard Changes': emptyProps(),

    'Set Current Tab Id': props<{ tabId: string | null }>(),

    'Rename Tab': props<{ tabInfo: EntityInfo }>(),

    'Reorder Tabs': props<{ tabsIdsOrdered: string[] }>(),

    'Add Tab': props<{ tabInfo: EntityInfo }>(),

    'Delete Current Tab': emptyProps(),
  },
});
