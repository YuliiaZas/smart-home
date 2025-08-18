import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { HomeItemInfo } from '@shared/models';
import { homeItemsFeature } from './home-items.state';
import { homeItemsActions, homeItemsApiActions } from './home-items.actions';

@Injectable({
  providedIn: 'root',
})
export class DevicesFacade {
  #store = inject(Store);

  get allItems$(): Observable<HomeItemInfo[]> {
    return this.#store.select(homeItemsFeature.selectAll);
  }

  get areAllItemsLoading$(): Observable<boolean> {
    return this.#store.select(homeItemsFeature.selectAreAllItemsLoading);
  }

  getItemsByIds$(itemsIds: string[]): Observable<HomeItemInfo[]> {
    return this.#store
      .select(homeItemsFeature.selectEntities)
      .pipe(map((entities) => itemsIds.map((id) => entities[id]).filter((item): item is HomeItemInfo => !!item)));
  }

  setDeviceState(deviceId: string, newState: boolean): void {
    this.#store.dispatch(homeItemsActions.setDeviceState({ deviceId, newState }));
  }

  setStateForDevices(devicesIds: string[], newState: boolean): void {
    this.#store.dispatch(homeItemsActions.setStateForDevices({ devicesIds, newState }));
  }

  loadAllHomeItems(): void {
    this.#store.dispatch(homeItemsApiActions.loadAllHomeItems());
  }
}
