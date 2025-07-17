import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ItemWithIconDirective } from '../shared/item-with-icon/item-with-icon.directive';
import { SensorInfo } from '../shared/models/home-card-info';
import { UnitsPipe } from '../shared/units/units.pipe';

@Component({
  selector: 'app-sensor',
  imports: [MatIcon, ItemWithIconDirective, UnitsPipe],
  templateUrl: './sensor.html',
  styleUrl: './sensor.scss',
})
export class Sensor {
  data = input.required<SensorInfo>();
  iconPosition = input<'left' | 'right'>('left');
}
