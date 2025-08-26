import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { CardLayout, DeviceInfo, HomeCardWithItemsIdsInfo, HomeItemInfo } from '@shared/models';
import { isDeviceInfo } from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class HomeCardService {
  getIsSingleItem(cardData: HomeCardWithItemsIdsInfo): boolean {
    return cardData.layout === CardLayout.SINGLE && cardData.items.length === 1;
  }

  selectDevices(itemsIds: string[], homeItemsEntities: Dictionary<HomeItemInfo>): DeviceInfo[] {
    return itemsIds.map((id) => homeItemsEntities[id]).filter((item) => isDeviceInfo(item));
  }

  getAllDevicesState(devices: DeviceInfo[]): boolean {
    return devices.some((device) => device.state);
  }

  getDoesDeviceNeedChange(deviceId: string, entities: Dictionary<HomeItemInfo>, newState: boolean): boolean {
    const device = entities[deviceId];
    return isDeviceInfo(device) && device.state !== newState;
  }
}
