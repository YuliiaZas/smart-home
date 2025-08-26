import { Injectable } from '@angular/core';
import { CardLayout, DeviceInfo, HomeCardInfo, HomeItemInfo } from '@shared/models';
import { isDeviceInfo } from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class HomeCardService {
  getIsSingleItem(cardData: HomeCardInfo): boolean {
    return cardData.layout === CardLayout.SINGLE && cardData.items.length === 1;
  }

  getDevicesFromCardData(cardData: HomeCardInfo): DeviceInfo[] {
    return cardData.items.filter((item) => isDeviceInfo(item));
  }

  getAllDevicesState(devices: DeviceInfo[]): boolean {
    return devices.some((device) => device.state);
  }

  getUpdatedCardDataOnDeviceStateChange(cardData: HomeCardInfo, device?: HomeItemInfo): HomeCardInfo | null {
    if (!device || !('state' in device)) return null;

    const updatedItems = cardData.items.map((item) =>
      item.label === device.label ? { ...item, state: !device.state } : item
    );

    return { ...cardData, items: updatedItems };
  }

  getUpdatedCardDataOnAllDevicesStateChange(cardData: HomeCardInfo, newAllDevicesState: boolean): HomeCardInfo {
    const updatedItems = cardData.items.map((item) =>
      'state' in item ? { ...item, state: newAllDevicesState } : item
    );

    return { ...cardData, items: updatedItems };
  }
}
