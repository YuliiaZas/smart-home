import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DeviceInfo, CardLayout } from '@shared/models';
import { UnitsPipe } from '@shared/pipes';
import { Card } from '@shared/components';
import { Sensor } from '../../home-sensor/home-sensor';
import { Device } from '../../home-device/home-device';
import { HomeCardBase } from '../home-card-base/home-card-base';

@Component({
  selector: 'app-home-card-multiple',
  imports: [MatSlideToggle, Card, Sensor, Device, UnitsPipe],
  templateUrl: './home-card-multiple.html',
  styleUrl: './home-card-multiple.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardMultiple extends HomeCardBase {
  headerClass = 'heading-2';

  isContentVertical = computed(() => this.data().layout === CardLayout.VERTICAL);
  iconPosition = computed(() => (this.isContentVertical() ? 'bottom' : 'left'));

  private devices = computed(() => {
    const items = this.data().items;
    return items.filter((item) => item.type === 'device') as DeviceInfo[];
  });
  showAllDevicesState = computed(() => this.devices().length > 1);
  allDevicesState = computed(() => this.devices().some((device) => device.state));

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
