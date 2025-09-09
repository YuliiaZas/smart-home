import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, of } from 'rxjs';
import { catchError, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { DevicesService, HomeItemsApi } from '@core/home-items';
import { homeItemsActions, homeItemsApiActions } from './home-items.actions';
import { homeItemsFeature } from './home-items.state';
import { FailureAction } from '@shared/models';

@Injectable()
export class HomeItemsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private devicesService = inject(DevicesService);
  private homeItemsApi = inject(HomeItemsApi);

  setDeviceState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeItemsActions.setDeviceState),
      withLatestFrom(this.store.select(homeItemsFeature.selectEntities)),
      filter(([{ deviceId, newState }, entities]) =>
        this.devicesService.getDoesDeviceNeedChange(deviceId, entities, newState)
      ),
      map(([{ deviceId, newState }]) => homeItemsApiActions.setDeviceState({ deviceId, newState }))
    )
  );

  setStateForDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeItemsActions.setStateForDevices),
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

  setDeviceStateApi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeItemsApiActions.setDeviceState),
      switchMap(({ deviceId, newState }) =>
        this.homeItemsApi.updateDeviceState(deviceId, newState).pipe(
          map(() => homeItemsApiActions.setDeviceStateSuccess()),
          catchError((error) =>
            of(
              homeItemsApiActions.setDeviceStateFailure({
                error,
                action: FailureAction.ChangeDeviceState,
                deviceId,
                oldState: !newState,
              })
            )
          )
        )
      )
    )
  );

  setStateForDevicesApi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeItemsApiActions.setStateForDevices),
      switchMap(({ devicesIds, newState }) =>
        this.homeItemsApi.updateDevicesState(devicesIds, newState).pipe(
          map(({ failedIds, error }) => {
            return failedIds.length > 0
              ? homeItemsApiActions.setStateForDevicesFailure({
                  error: error!,
                  action: FailureAction.ChangeDevicesState,
                  devicesIds: failedIds,
                  oldState: !newState,
                })
              : homeItemsApiActions.setStateForDevicesSuccess();
          })
        )
      )
    )
  );

  loadAllHomeItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeItemsApiActions.loadAllHomeItems),
      switchMap(() =>
        this.homeItemsApi.fetchAllHomeItems().pipe(
          map((homeItems) => homeItemsApiActions.loadAllHomeItemsSuccess({ homeItems })),
          catchError((error) =>
            of(homeItemsApiActions.loadAllHomeItemsFailure({ error, action: FailureAction.LoadAllHomeItems }))
          )
        )
      )
    )
  );
}
