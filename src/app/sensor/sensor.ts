import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ItemWithIconDirective } from '../shared/item-with-icon/item-with-icon.directive';
import { SensorInfo } from '../shared/models/home-item-info';
import { UnitsPipe } from '../shared/units/units.pipe';
import { IconPositionInfo } from '../shared/item-with-icon/icon-position-info';

@Component({
  selector: 'app-sensor',
  imports: [MatIcon, ItemWithIconDirective, UnitsPipe],
  templateUrl: './sensor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sensor {
  data = input.required<SensorInfo>();
  iconPosition = input<IconPositionInfo>('left');
  typesWithHiddenAmount = input<string[]>(['cloud', 'motion_photos_on']);
}
