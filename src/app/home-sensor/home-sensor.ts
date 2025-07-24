import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconPositionInfo } from '@shared/directives';
import { SensorInfo } from '@shared/models';
import { UnitsPipe, AddTitleToLabelPipe } from '@shared/pipes';
import { HomeItem } from '../home-item/home-item';

@Component({
  selector: 'app-sensor',
  imports: [UnitsPipe, HomeItem, AddTitleToLabelPipe],
  templateUrl: './home-sensor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sensor {
  data = input.required<SensorInfo>();
  cardTitle = input<string>('');
  iconPosition = input<IconPositionInfo>('left');
  showValue = input(true);
  typesWithHiddenAmount = input<string[]>(['cloud', 'motion_photos_on']);
}
