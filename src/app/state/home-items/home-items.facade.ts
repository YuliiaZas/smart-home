import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { HomeItemInfo } from '@shared/models';
import { homeItemsFeature } from './home-items.state';
import { homeItemsActions, homeItemsApiActions } from './home-items.actions';

@Injectable({
  providedIn: 'root',
})
export class HomeItemsFacade {
  #store = inject(Store);

  get itemsEntities$(): Observable<Dictionary<HomeItemInfo>> {
    return this.#store.select(homeItemsFeature.selectEntities);
  }

  get allItems$(): Observable<HomeItemInfo[]> {
    return this.#store.select(homeItemsFeature.selectAll);
  }

  get areAllItemsLoading$(): Observable<boolean> {
    return this.#store.select(homeItemsFeature.selectAreAllItemsLoading);
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
