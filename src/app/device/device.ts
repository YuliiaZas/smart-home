import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DeviceInfo } from '../shared/models/home-item-info';
import { IconPositionInfo } from '../shared/item-with-icon/icon-position-info';
import { HomeItem } from '../home-item/home-item';

@Component({
  selector: 'app-device',
  imports: [MatSlideToggle, HomeItem],
  templateUrl: './device.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Device {
  data = input.required<DeviceInfo>();
  iconPosition = input<IconPositionInfo>('left');
  hideStateToggle = input(false);
  showStateToggle = input(false);

  changeState = output<string>();

  emitChangeState() {
    this.changeState.emit(this.data().label);
  }
}
