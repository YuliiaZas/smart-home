import { Component, computed, model, output } from '@angular/core';
import { DeviceInfo, HomeCardInfo, HomeItemInfo } from '../shared/models/home-card-info';
import * as mockData from '../shared/constants/mock-data.json';
import { Card } from '../shared/card/card';
import { Sensor } from '../sensor/sensor';
import { Device } from '../device/device';
import { CardLayout } from '../shared/models/card-layout.enum';
import { StateValuePipe } from '../shared/state-value.pipe';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home-card',
  imports: [MatSlideToggle, Card, Sensor, Device, StateValuePipe],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  data = model<HomeCardInfo>(mockData.tabs[0].cards[3] as HomeCardInfo);
  updateCardData = output<HomeCardInfo>();

  private devices = computed(() => this.data().items.filter((item) => item.type === 'device') as DeviceInfo[]);
  getIconPosition = computed(() => (this.data().layout === CardLayout.HORIZONTAL ? 'left' : 'right'));
  isContentVertical = computed(() => this.data().layout === CardLayout.VERTICAL);
  isSingleDevice = computed(() => this.data().layout === CardLayout.SINGLE && this.devices().length === 1);
  singleDeviceState = computed<boolean | undefined>(() => this.devices()[0].state);
  showAllDevicesState = computed(() => this.devices().length > 1);
  allDevicesState = computed(() => this.devices().some((device) => device.state));

  changeDeviceState(device: HomeItemInfo) {
    if (!('state' in device)) return;

    this.data.update((currentData) => {
      const updatedItems = currentData.items.map((item) => {
        if (item.label === device.label) {
          return {
            ...item,
            state: !device.state,
          };
        }
        return item;
      });

      return {
        ...currentData,
        items: updatedItems,
      };
    });

    this.updateCardData.emit(this.data());
  }

  changeAllDevicesState() {
    const newState = !this.allDevicesState();
    this.data.update((currentData) => {
      const updatedItems = currentData.items.map((item) => {
        if ('state' in item) {
          return {
            ...item,
            state: newState,
          };
        }
        return item;
      });

      return {
        ...currentData,
        items: updatedItems,
      };
    });

    this.updateCardData.emit(this.data());
  }
}
