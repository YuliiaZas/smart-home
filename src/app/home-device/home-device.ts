import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DeviceInfo } from '@shared/models';
import { IconPositionInfo } from '@shared/directives';
import { HomeItemName } from '../home-item-name/home-item-name';

@Component({
  selector: 'app-device',
  imports: [MatSlideToggle, HomeItemName],
  templateUrl: './home-device.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Device {
  data = input.required<DeviceInfo>();
  iconPosition = input<IconPositionInfo>('left');

  changeState = output<string>();
}
