import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SensorInfo } from '../shared/models/home-item-info';
import { UnitsPipe } from '../shared/pipes/units-pipe/units-pipe';
import { IconPositionInfo } from '../shared/directives/item-with-icon/icon-position-info';
import { HomeItem } from '../home-item/home-item';
import { AddTitleToLabelPipe } from '../shared/pipes/add-title-to-label-pipe/add-title-to-label-pipe';

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
