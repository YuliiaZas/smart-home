import { ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { DeviceInfo, HomeItemInfo, SensorInfo } from '../shared/models/home-item-info';
import { HomeCardInfo } from '../shared/models/home-card-info';
import { Card } from '../shared/components/card/card';
import { Sensor } from '../home-sensor/home-sensor';
import { Device } from '../home-device/home-device';
import { CardLayout } from '../shared/models/card-layout.enum';
import { StateValuePipe } from '../shared/pipes/state-value-pipe';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UnitsPipe } from '../shared/pipes/units-pipe/units-pipe';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-home-card',
  imports: [NgTemplateOutlet, MatSlideToggle, Card, Sensor, Device, StateValuePipe, UnitsPipe],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCard {
  data = model.required<HomeCardInfo>();
  updateCardData = output<HomeCardInfo>();

  protected readonly sensorTypesWithHiddenAmount = ['cloud', 'motion_photos_on'];

  isContentVertical = computed(() => this.data().layout === CardLayout.VERTICAL);

  iconPosition = computed(() => this.getIconPosition(this.data().layout));

  singleItem = computed(() => {
    return this.data().layout === CardLayout.SINGLE && this.data().items.length === 1
      ? this.data().items[0]
      : undefined;
  });
  singleDevice = computed<DeviceInfo | undefined>(() =>
    this.singleItem()?.type === 'device' ? (this.singleItem() as DeviceInfo) : undefined
  );
  singleSensor = computed<SensorInfo | undefined>(() =>
    this.singleItem()?.type === 'sensor' ? (this.singleItem() as SensorInfo) : undefined
  );

  private devices = computed(() => this.data().items.filter((item) => item.type === 'device') as DeviceInfo[]);
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

  private getIconPosition(layout: CardLayout) {
    switch (layout) {
      case CardLayout.VERTICAL: {
        return 'bottom';
      }
      case CardLayout.SINGLE: {
        return 'right';
      }
      default: {
        return 'left';
      }
    }
  }
}
