import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CardLayout, DeviceInfo, HomeItemInfo } from '@shared/models';
import { UnitsPipe } from '@shared/pipes';
import { isDeviceInfo } from '@shared/utils';
import { Sensor } from '../../home-sensor/home-sensor';
import { Device } from '../../home-device/home-device';
import { HomeCardBase } from '../home-card-base/home-card-base';

@Component({
  selector: 'app-home-card-multiple',
  imports: [MatSlideToggle, Sensor, Device, UnitsPipe],
  templateUrl: './home-card-multiple.html',
  styleUrl: './home-card-multiple.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardMultiple extends HomeCardBase {
  isContentVertical = computed(() => this.cardData().layout === CardLayout.VERTICAL);
  iconPosition = computed(() => (this.isContentVertical() ? 'bottom' : 'left'));

  #devices = computed(() => this.#selectDevices(this.cardData().items, this.homeItemsEntities()));
  #devicesIds = computed(() => this.#devices().map((device) => device.id));
  showAllDevicesState = computed(() => this.#devices().length > 1);
  allDevicesState = computed(() => this.#devices().some((device) => device.state));

  changeAllDevicesState() {
    this.homeItemsFacade.setStateForDevices(this.#devicesIds(), !this.allDevicesState());
  }

  #selectDevices(itemsIds: string[], homeItemsEntities: Dictionary<HomeItemInfo>): DeviceInfo[] {
    return itemsIds.map((id) => homeItemsEntities[id]).filter((item) => isDeviceInfo(item));
  }
}
