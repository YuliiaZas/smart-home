import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ItemWithIconDirective } from '../shared/item-with-icon/item-with-icon.directive';
import { DeviceInfo } from '../shared/models/home-item-info';
import { IconPositionInfo } from '../shared/item-with-icon/icon-position-info';

@Component({
  selector: 'app-device',
  imports: [MatIcon, MatSlideToggle, ItemWithIconDirective],
  templateUrl: './device.html',
  styleUrl: './device.scss',
})
export class Device {
  data = input.required<DeviceInfo>();
  iconPosition = input<IconPositionInfo>('left');
  hideStateToggle = input(false);

  changeState = output<string>();

  activeIcon = computed(() => !!this.data().state);

  handleIconClick() {
    if (this.hideStateToggle()) {
      this.emitChangeState();
    }
  }

  emitChangeState() {
    this.changeState.emit(this.data().label);
  }
}
