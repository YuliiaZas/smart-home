import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UnitsPipe } from '@shared/pipes';
import { DevicesService } from '@shared/services';
import { Sensor } from '../../home-sensor/home-sensor';
import { Device } from '../../home-device/home-device';
import { HomeCardBase } from '../home-card-base/home-card-base';
import { HomeCardService } from '../home-card.service';

@Component({
  selector: 'app-home-card-multiple',
  imports: [MatSlideToggle, Sensor, Device, UnitsPipe],
  templateUrl: './home-card-multiple.html',
  styleUrl: './home-card-multiple.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardMultiple extends HomeCardBase {
  #cardService = inject(HomeCardService);
  #devicesService = inject(DevicesService);

  isContentVertical = computed(() => this.#cardService.getIsContentVertical(this.cardData()));
  iconPosition = computed(() => this.#cardService.getIconPosition(this.isContentVertical()));

  #devices = computed(() => this.#devicesService.selectDevices(this.cardData().items, this.homeItemsEntities()));
  #devicesIds = computed(() => this.#devices().map((device) => device.id));
  showAllDevicesState = computed(() => this.#devices().length > 1);
  allDevicesState = computed(() => this.#devicesService.getAllDevicesState(this.#devices()));

  changeAllDevicesState() {
    this.homeItemsFacade.setStateForDevices(this.#devicesIds(), !this.allDevicesState());
  }
}
