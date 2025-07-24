import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DeviceInfo } from '@shared/models';
import { IconPositionInfo } from '@shared/directives';
import { AddTitleToLabelPipe } from '@shared/pipes';
import { HomeItem } from '../home-item/home-item';

@Component({
  selector: 'app-device',
  imports: [MatSlideToggle, HomeItem, AddTitleToLabelPipe],
  templateUrl: './home-device.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Device {
  data = input.required<DeviceInfo>();
  cardTitle = input<string>('');
  iconPosition = input<IconPositionInfo>('left');
  showStateToggle = input(false);

  changeState = output<string>();

  emitChangeState() {
    this.changeState.emit(this.data().label);
  }
}
