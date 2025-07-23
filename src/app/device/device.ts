import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ItemWithIconDirective } from '../shared/item-with-icon/item-with-icon.directive';
import { DeviceInfo } from '../shared/models/home-item-info';
import { IconPositionInfo } from '../shared/item-with-icon/icon-position-info';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-device',
  imports: [NgClass, MatIcon, MatSlideToggle, ItemWithIconDirective],
  templateUrl: './device.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Device {
  data = input.required<DeviceInfo>();
  iconPosition = input<IconPositionInfo>('left');
  hideStateToggle = input(false);

  changeState = output<string>();

  activeIcon = computed(() => !!this.data().state);

  iconClass = computed(() => (this.hideStateToggle() ? 'w-100 cursor-pointer justify-content-between' : ''));

  handleIconClick() {
    if (this.hideStateToggle()) {
      this.emitChangeState();
    }
  }

  emitChangeState() {
    this.changeState.emit(this.data().label);
  }
}
