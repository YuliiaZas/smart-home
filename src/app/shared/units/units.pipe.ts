import { Pipe, type PipeTransform } from '@angular/core';
import { UnitsInfo } from './units-info';

@Pipe({
  name: 'appUnits',
})
export class UnitsPipe implements PipeTransform {
  transform(value: UnitsInfo): string {
    return `${value.amount} ${value.unit}`;
  }
}
