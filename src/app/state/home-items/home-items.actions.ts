import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardTab, FailureAction, HomeItemInfo, StateError } from '@shared/models';

export const homeItemsActions = createActionGroup({
  source: 'Home Items',
  events: {
    'Set Current Dashboard Home Items': props<{ tabs: DashboardTab[] }>(),

    'Set Device State': props<{ deviceId: string; newState: boolean }>(),

    'Set State For Devices': props<{ devicesIds: string[]; newState: boolean }>(),

    'Load All Home Items': emptyProps(),

    'Reset Home Items': emptyProps(),
  },
});

export const homeItemsApiActions = createActionGroup({
  source: 'Home Items API',
  events: {
    'Load All Home Items': emptyProps(),
    'Load All Home Items Success': props<{ homeItems: HomeItemInfo[] }>(),
    'Load All Home Items Failure': props<{ action: FailureAction; error: StateError['error'] }>(),

    'Set Device State': props<{ deviceId: string; newState: boolean }>(),
    'Set Device State Success': emptyProps(),
    'Set Device State Failure': props<{
      deviceId: string;
      oldState: boolean;
      action: FailureAction;
      error: StateError['error'];
    }>(),

    'Set State For Devices': props<{ devicesIds: string[]; newState: boolean }>(),
    'Set State For Devices Success': emptyProps(),
    'Set State For Devices Failure': props<{
      devicesIds: string[];
      oldState: boolean;
      action: FailureAction;
      error: StateError['error'];
    }>(),
  },
});
