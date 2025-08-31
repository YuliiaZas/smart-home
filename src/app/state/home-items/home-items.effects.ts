import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { DevicesService } from '@shared/services';
import { homeItemsApiActions } from './home-items.actions';
import { homeItemsFeature } from './home-items.state';

@Injectable()
export class HomeItemsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private devicesService = inject(DevicesService);

  setDeviceState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeItemsApiActions.setDeviceState),
      withLatestFrom(this.store.select(homeItemsFeature.selectEntities)),
      filter(([{ deviceId, newState }, entities]) =>
        this.devicesService.getDoesDeviceNeedChange(deviceId, entities, newState)
      ),
      map(([{ deviceId, newState }]) => homeItemsApiActions.setDeviceState({ deviceId, newState }))
    )
  );

  setStateForDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeItemsApiActions.setStateForDevices),
      withLatestFrom(this.store.select(homeItemsFeature.selectEntities)),
      map(([{ devicesIds, newState }, entities]) => ({
        devicesIds: devicesIds.filter((deviceId) =>
          this.devicesService.getDoesDeviceNeedChange(deviceId, entities, newState)
        ),
        newState,
      })),
      map(({ devicesIds, newState }) => homeItemsApiActions.setStateForDevices({ devicesIds, newState }))
    )
  );
}
