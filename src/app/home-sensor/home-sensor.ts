import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconPositionInfo } from '@shared/directives';
import { SensorInfo } from '@shared/models';
import { HomeItemName } from '../home-item-name/home-item-name';

@Component({
  selector: 'app-sensor',
  imports: [HomeItemName],
  templateUrl: './home-sensor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sensor {
  sensorData = input.required<SensorInfo>();
  iconPosition = input<IconPositionInfo>('left');
}
