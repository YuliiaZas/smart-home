import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CardLayout } from '@shared/models';
import { UnitsPipe } from '@shared/pipes';
import { Card } from '@shared/components';
import { Sensor } from '../../home-sensor/home-sensor';
import { Device } from '../../home-device/home-device';
import { HomeCardBase } from '../home-card-base/home-card-base';
import { isDeviceInfo } from '@shared/utils';

@Component({
  selector: 'app-home-card-multiple',
  imports: [MatSlideToggle, Card, Sensor, Device, UnitsPipe],
  templateUrl: './home-card-multiple.html',
  styleUrl: './home-card-multiple.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardMultiple extends HomeCardBase {
  headerClass = 'heading-2';

  isContentVertical = computed(() => this.cardData().layout === CardLayout.VERTICAL);
  iconPosition = computed(() => (this.isContentVertical() ? 'bottom' : 'left'));

  private devices = computed(() => {
    const items = this.cardData().items;
    return items.filter((item) => isDeviceInfo(item));
  });
  showAllDevicesState = computed(() => this.devices().length > 1);
  allDevicesState = computed(() => this.devices().some((device) => device.state));

  changeAllDevicesState() {
    const newState = !this.allDevicesState();

    this.cardData.update((currentCardData) => {
      const updatedItems = currentCardData.items.map((item) => ('state' in item ? { ...item, state: newState } : item));

      return { ...currentCardData, items: updatedItems };
    });

    this.updateCardData.emit(this.cardData());
  }
}
