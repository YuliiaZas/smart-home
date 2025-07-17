import { Component, computed, input, output } from '@angular/core';
import { HomeCardInfo, HomeItemInfo } from '../shared/models/home-card-info';
import * as mockData from '../shared/constants/mock-data.json';
import { Card } from '../shared/card/card';
import { Sensor } from '../sensor/sensor';
import { Device } from '../device/device';
import { CardLayout } from '../shared/models/card-layout.enum';
import { StateValuePipe } from '../shared/state-value.pipe';

@Component({
  selector: 'app-home-card',
  imports: [Card, Sensor, Device, StateValuePipe],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  data = input<HomeCardInfo>(mockData.tabs[1].cards[0] as HomeCardInfo);
  updateCardData = output<HomeCardInfo>();

  getIconPosition = computed(() => (this.data().layout === CardLayout.HORIZONTAL ? 'left' : 'right'));
  isSingleDevice = computed(() => this.data().layout === CardLayout.SINGLE);
  singleDeviceState = computed<boolean | undefined>(() => {
    const device = this.data().items[0];
    return 'state' in device ? device.state : undefined;
  });

  changeDeviceState(device: HomeItemInfo) {
    if (!('state' in device)) return;

    const updatedData = {
      ...this.data(),
      items: this.data().items.map((item) => {
        if (item.label === device.label) {
          return {
            ...item,
            state: !device.state,
          };
        }
        return item;
      }),
    };

    this.updateCardData.emit(updatedData);
  }
}
