import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SENSOR_TYPES_WITH_HIDDEN_AMOUNT } from '@shared/constants';
import { IconPositionInfo } from '@shared/directives';
import { DeviceInfo, HomeItemInfo, SensorInfo, HomeCardInfo, CardLayout } from '@shared/models';
import { AddTitleToLabelPipe, StateValuePipe, UnitsPipe } from '@shared/pipes';
import { Card } from '@shared/components';
import { Sensor } from '../home-sensor/home-sensor';
import { Device } from '../home-device/home-device';
import { HomeItemIcon } from '../home-item-icon/home-item-icon';

@Component({
  selector: 'app-home-card',
  imports: [
    NgTemplateOutlet,
    MatSlideToggle,
    Card,
    Sensor,
    Device,
    StateValuePipe,
    UnitsPipe,
    AddTitleToLabelPipe,
    HomeItemIcon,
  ],
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCard {
  data = model.required<HomeCardInfo>();
  updateCardData = output<HomeCardInfo>();

  protected readonly sensorTypesWithHiddenAmount = SENSOR_TYPES_WITH_HIDDEN_AMOUNT;

  isContentVertical = computed(() => this.data().layout === CardLayout.VERTICAL);

  iconPosition = computed(() => this.getIconPosition(this.data().layout));

  singleItem = computed<HomeItemInfo | undefined>(() => {
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

  headerClass = computed(() => (this.singleItem() ? 'body-1' : 'heading-2'));

  private devices = computed(() => {
    const items = this.data().items;
    return items.filter((item) => item.type === 'device') as DeviceInfo[];
  });
  showAllDevicesState = computed(() => this.devices().length > 1);
  allDevicesState = computed(() => this.devices().some((device) => device.state));

  changeDeviceState(device?: HomeItemInfo) {
    if (!device || !('state' in device)) return;

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

  private getIconPosition(layout: CardLayout): IconPositionInfo {
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
