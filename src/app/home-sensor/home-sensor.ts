import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconPositionInfo } from '@shared/directives';
import { SensorInfo } from '@shared/models';
import { HomeItem } from '../home-item/home-item';

@Component({
  selector: 'app-sensor',
  imports: [HomeItem],
  templateUrl: './home-sensor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sensor {
  data = input.required<SensorInfo>();
  cardTitle = input<string>('');
  iconPosition = input<IconPositionInfo>('left');
  showValue = input(true);
}
