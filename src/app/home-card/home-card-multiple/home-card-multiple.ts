import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CardLayout } from '@shared/models';
import { UnitsPipe } from '@shared/pipes';
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

  isContentVertical = computed(() => this.cardData().layout === CardLayout.VERTICAL);
  iconPosition = computed(() => (this.isContentVertical() ? 'bottom' : 'left'));

  #devices = computed(() => this.#cardService.selectDevices(this.cardData().items, this.homeItemsEntities()));
  #devicesIds = computed(() => this.#devices().map((device) => device.id));
  showAllDevicesState = computed(() => this.#devices().length > 1);
  allDevicesState = computed(() => this.#cardService.getAllDevicesState(this.#devices()));

  changeAllDevicesState() {
    this.homeItemsFacade.setStateForDevices(this.#devicesIds(), !this.allDevicesState());
  }
}
